const mongoose = require("mongoose");
const config = require("config");
const bcrypt = require("bcrypt");

const { User } = require("../Models/userModel");
const db_url = config.get("db_url");
async function connectDB() {
  const con = await mongoose.connect(db_url);
  if (con) {
    console.log(`Connected to Database : ${db_url}`);
    let user = await User.findOne({ email: "nitinn@valueaddsofttech.com" });
    if (user) return;
    user = new User({
      firstName: "Nitin",
      lastName: "Nimangare",
      email: "nitinn@valueaddsofttech.com",
      phone: "9730828016",
      userName: "NITIN123",
      password: "password",
      role: "admin",
    });
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash("password", salt);
      const result = await user.save();
      console.log("Admin Registration Completed Successfully");
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = connectDB;
