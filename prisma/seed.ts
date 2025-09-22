import { createUser } from "../lib/user";
import bcrypt from "bcrypt";

async function seed() {
  // Hash passwords for security
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("admin123", 10);
  const hashedPassword3 = await bcrypt.hash("user123", 10);

  try {
    // Create admin user
    await createUser({
      email: "admin@rvidia.com",
      username: "admin",
      password: hashedPassword2,
      name: "Administrator",
    });

    // Create regular users
    await createUser({
      email: "alice@example.com",
      username: "alice",
      password: hashedPassword1,
      name: "Alice Johnson",
    });

    await createUser({
      email: "bob@example.com",
      username: "bob",
      password: hashedPassword3,
      name: "Bob Smith",
    });

    console.log("Sample users created successfully!");
    console.log("Admin user: admin@rvidia.com / admin123");
    console.log("Test user: alice@example.com / password123");
    console.log("Test user: bob@example.com / user123");
  } catch (error) {
    console.error("Error creating users:", error);
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
