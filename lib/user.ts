import prisma from "../lib/prisma";

export async function createUser({
  email,
  username,
  password,
  googleId,
  name,
}: {
  email: string;
  username: string;
  password: string;
  googleId?: string;
  name?: string;
}) {
  try {
    // If name is not provided, use username as the display name
    const displayName = name || username;

    return await prisma.user.create({
      data: {
        email,
        username,
        password,
        googleId,
        name: displayName,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserByUsername(username: string) {
  try {
    // First try to find the user with the username field
    // Using findFirst with raw SQL condition as a workaround for TypeScript issues
    const userByUsername = await prisma.$queryRaw`
      SELECT * FROM "User" WHERE "username" = ${username} LIMIT 1
    `;

    if (userByUsername && userByUsername.length > 0) {
      return userByUsername[0];
    }

    // If not found, try checking if any user has this as their name
    // This is for backward compatibility with older users
    return await prisma.user.findFirst({
      where: {
        name: username,
      },
    });
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
}

export async function getUserByIdentifier(identifier: string) {
  // Try to find user by email first
  const userByEmail = await getUserByEmail(identifier);
  if (userByEmail) return userByEmail;

  // If not found, try by username
  return await getUserByUsername(identifier);
}

export async function updateUser(
  id: number,
  data: {
    password?: string;
    googleId?: string;
    name?: string;
    username?: string;
  }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: number) {
  return await prisma.user.delete({
    where: { id },
  });
}
