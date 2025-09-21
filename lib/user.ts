import prisma from "../lib/prisma";

export async function createUser({
  email,
  password,
  googleId,
  name,
}: {
  email: string;
  password: string;
  googleId?: string;
  name?: string;
}) {
  return await prisma.user.create({
    data: { email, password, googleId, name },
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function updateUser(
  id: number,
  data: { password?: string; googleId?: string; name?: string }
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
