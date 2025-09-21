// Script to reset a specific user's password
import prisma from "../lib/prisma";
// Removed the hash import since we'll store the password directly

async function resetPassword() {
  const email = "naikm.sam@gmail.com";
  const newPassword = "Samarth2006@";

  try {
    console.log(`Resetting password for user: ${email}`);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return;
    }

    // No hashing - store password directly
    // This is NOT recommended for production but useful for testing

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newPassword }, // Store the raw password
    });

    console.log("Password has been reset successfully");
    console.log(`New password stored directly: ${newPassword}`);
  } catch (error) {
    console.error("Error resetting password:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
resetPassword();

// Run the function
resetPassword();
