const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

async function seed() {
  await User.deleteMany({}); 

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  await User.insertMany([
    {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      isAdmin: true,
    },
    {
      name: "Normal User",
      email: "user@example.com",
      password: userPassword,
      isAdmin: false,
    },
  ]);

  console.log("Users seeded successfully");
  process.exit();
}

seed();