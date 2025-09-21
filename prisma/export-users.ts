import prisma from "../lib/prisma";
import { writeFileSync } from "fs";

async function exportUsersToCSV() {
  // Use raw SQL to get all fields including the new ones
  const users = (await prisma.$queryRaw`
    SELECT id, email, username, password, googleId, name, role, createdAt 
    FROM "User"
  `) as any[];

  const csvRows = ["id,email,username,password,googleId,name,role,createdAt"];
  for (const user of users) {
    csvRows.push(
      `"${user.id}","${user.email}","${user.username ?? ""}","${
        user.password
      }","${user.googleId ?? ""}","${user.name ?? ""}","${
        user.role ?? "USER"
      }","${user.createdAt}"`
    );
  }
  writeFileSync("users.csv", csvRows.join("\n"));
  console.log("User data exported to users.csv");
}

exportUsersToCSV().catch((e) => {
  console.error(e);
  process.exit(1);
});
