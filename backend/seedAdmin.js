const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { email: "admin@community.com" },
      {
        name: "Admin",
        email: "admin@community.com",
        password: hashedPassword,
        role: "admin"
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    console.log("Admin user seeded successfully");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed admin user:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
