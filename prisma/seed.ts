import { createUser } from "../lib/user";

async function seed() {
  await createUser({
    email: "alice@example.com",
    password: "password123",
    googleId: "alice-google-id",
    name: "Alice",
  });
  await createUser({
    email: "bob@example.com",
    password: "securepass456",
    googleId: "bob-google-id",
    name: "Bob",
  });
  await createUser({
    email: "charlie@example.com",
    password: "charliepass789",
    name: "Charlie",
  });
  console.log("Sample users created.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
