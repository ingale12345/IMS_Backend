const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "Length of First Name Should be greater than 3 letters"],
    maxLength: [20, "Length of First Name should be less than 20 letters"],
  },
  // address: {
  //   type: String,
  //   required: true,
  // },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Length of Last Name Should be greater than 3 letters"],
    maxLength: [20, "Length of Last Name should be less than 20 letters"],
  },
  email: {
    type: String,
    required: true,
    minLength: [5, "Email should not be less than 5 letters"],
    maxLength: [255, "Email should not be greater than 255 letters"],
  },
  phone: {
    type: Number,
    required: true,
    minLength: [7, "phone number should be greater than 7 digit"],
    maxLength: [10, "phone number should not be greater than 10 digit"],
  },
  userName: {
    type: String,
    unique: true,
    minLength: [5, "user Name should not less than 5 letters"],
    maxLength: [50, "user Name should not be greater than 50 letters"],
  },
  password: {
    type: String,
    required: true,
    minLength: [5, "Password should not less than 5 letters"],
    maxLength: [1024, "Password should not be greater than 1024 letters"],
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["admin", "customer", "shopkeeper"],
      message: "Values should be admin or customer or shopkeeper",
    },
    default: "customer",
  },
  lastLoggedIn: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    default: null,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  profile: {
    image: {
      type: Buffer,
    },
    imageName: String,
    mimetype: String,
  },
});
userSchema.methods.getAuthToken = function () {
  console.log(config.get("jwtPrivateKey"));
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      name: this.firstName + " " + this.lastName,
      isActive: this.isActive,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("user", userSchema);

module.exports.userSchema = userSchema;
module.exports.User = User;
