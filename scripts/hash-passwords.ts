import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth-utils";

const prisma = new PrismaClient();

async function hashExistingPasswords() {
  try {
    console.log("Starting password hashing process...");

    // Get all users with plain text passwords
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    console.log(`Found ${users.length} users to process`);

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2b$)
      if (user.password.startsWith("$2b$")) {
        console.log(
          `Password for ${
            user.username || user.email
          } is already hashed, skipping...`
        );
        continue;
      }

      console.log(`Hashing password for ${user.username || user.email}...`);

      // Hash the plain text password
      const hashedPassword = await hashPassword(user.password);

      // Update the user with the hashed password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`✓ Updated password for ${user.username || user.email}`);
    }

    console.log("Password hashing completed successfully!");
  } catch (error) {
    console.error("Error hashing passwords:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
hashExistingPasswords();
