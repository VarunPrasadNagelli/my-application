const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(db);
    console.info("Database connected!");
  } catch (error) {
    console.error(`Failed to connect Database ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
