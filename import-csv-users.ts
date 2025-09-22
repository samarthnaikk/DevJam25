import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function importUsersFromCSV() {
  try {
    // Read the CSV file
    const csvPath = path.join(process.cwd(), "users.csv");
    const csvData = fs.readFileSync(csvPath, "utf-8");

    // Parse CSV (skip header)
    const lines = csvData.split("\n").slice(1);

    console.log("🔄 Starting user import from CSV...");

    for (const line of lines) {
      if (line.trim() === "") continue;

      // Parse CSV line (handle quoted fields)
      const matches = line.match(/\"([^\"]*)\"/g);
      if (!matches || matches.length < 7) {
        console.log(`⚠️  Skipping invalid line: ${line}`);
        continue;
      }

      const id = parseInt(matches[0].replace(/\"/g, ""));
      const email = matches[1].replace(/\"/g, "");
      const username = matches[2].replace(/\"/g, "");
      const password = matches[3].replace(/\"/g, "");
      const googleId = matches[4].replace(/\"/g, "") || null;
      const name = matches[5].replace(/\"/g, "");
      const role = matches[6].replace(/\"/g, "") as "USER" | "ADMIN";
      const createdAt = matches[7]
        ? new Date(matches[7].replace(/\"/g, ""))
        : new Date();

      console.log(`👤 Processing user: ${username} (${email})`);

      try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: email }, { username: username }],
          },
        });

        if (existingUser) {
          console.log(`✅ User ${username} already exists, updating...`);

          // Update existing user
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              email,
              username,
              password: password || existingUser.password, // Keep existing password if CSV has empty password
              googleId,
              name,
              role,
              createdAt,
            },
          });
        } else {
          console.log(`➕ Creating new user: ${username}`);

          // Create new user
          await prisma.user.create({
            data: {
              email,
              username,
              password: password || "", // Handle empty passwords
              googleId,
              name,
              role,
              createdAt,
            },
          });
        }

        console.log(`✅ Successfully processed: ${username}`);
      } catch (userError) {
        console.error(`❌ Error processing user ${username}:`, userError);
      }
    }

    console.log("🎉 CSV import completed!");

    // List all users
    const allUsers = await prisma.user.findMany();
    console.log("\n📋 Current users in database:");
    allUsers.forEach((user) => {
      console.log(`  - ${user.username} (${user.email}) - ${user.role}`);
    });
  } catch (error) {
    console.error("❌ Import failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importUsersFromCSV();
