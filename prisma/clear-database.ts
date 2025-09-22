// Script to empty all tables in the database
import prisma from "../lib/prisma";

async function clearDatabase() {
  try {
    console.log("Starting database cleanup...");

    // Get the list of models from Prisma schema
    // For SQLite, we need to delete from each table individually
    // We'll delete from User table which seems to be your main table

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`Deleted ${deletedUsers.count} users`);

    // You can add more tables here if needed, for example:
    // await prisma.posts.deleteMany({});
    // await prisma.comments.deleteMany({});

    console.log("Database has been cleared successfully");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the clear function
clearDatabase();
