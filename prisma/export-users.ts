import prisma from "../lib/prisma";
import { writeFileSync } from "fs";

async function exportUsersToCSV() {
  const users = await prisma.user.findMany();
  const csvRows = ["id,email,password,googleId,name,createdAt"];
  for (const user of users) {
    csvRows.push(
      `"${user.id}","${user.email}","${user.password}","${
        user.googleId ?? ""
      }","${user.name ?? ""}","${user.createdAt.toISOString()}"`
    );
  }
  writeFileSync("users.csv", csvRows.join("\n"));
  console.log("User data exported to users.csv");
}

exportUsersToCSV().catch((e) => {
  console.error(e);
  process.exit(1);
});
