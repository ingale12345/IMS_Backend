const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const lodash = require("lodash");
const router = express.Router();
const fs = require("fs");
const { User, userSchema } = require("../Models/userModel");
const sharp = require("sharp");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/", upload.single("profile"), async (req, res) => {
  const img = fs.readFileSync(
    "D:\\Mudik_Trainee\\NODE JS\\Inventory\\NoProfile.jpg"
  );
  const buffer = await sharp(req.file?.buffer || img)
    .resize({ width: 250, height: 250 })
    .toBuffer();
  const availableUser = await User.findOne({ email: req.body.email });
  if (availableUser)
    return res.status(400).send("You cannot register with the same email id");
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    userName: req.body.userName,
    password: req.body.password,
    role: req.body.role,
    profile: {
      image: buffer,
      imageName: Date.now() + "-" + req.file?.originalname || "UserImage.jpg",
      mimetype: req.file?.mimetype || "image/jpg",
    },
  });
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    const result = await user.save();
    console.log("User saved into database");
    res
      .status(200)
      .send(
        lodash.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "phone",
          "userName",
          "role",
          "profile",
        ])
      );
    // res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});
router.patch("/:id", upload.single("profile"), async (req, res) => {
  const img = fs.readFileSync(
    "D:\\Mudik_Trainee\\NODE JS\\Inventory\\NoProfile.jpg"
  );

  let user;
  if (!req.file) {
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        userName: req.body.userName,
      },
    });
  } else {
    user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        userName: req.body.userName,
        profile: {
          image: await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .toBuffer(),
          imageName: Date.now() + "-" + req.file.originalname,
          mimetype: req.file.mimetype,
        },
      },
    });
  }
  // if (!user) return res.status(400).send("Unable to update User");
  // return res.status(200).send(user);

  try {
    if (!user) return res.status(400).send("Unable to update User");
    // console.log(user);
    res
      .status(200)
      .send(
        lodash.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "phone",
          "userName",
          "role",
          "profile",
        ])
      );
  } catch (error) {
    console.log(error);
  }
});
router.post("/search", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const users = await User.find({
      $or: [{ firstName: regEx }, { lastName: regEx }],
    });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) return res.status(404).send("Users not found");
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send("Users not found with given ID");
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(400).send("Unable to Delete User Or User not found");
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          isActive: req.body.isActive,
          updatedBy: req.body.adminId,
          updatedAt: Date.now(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          userName: req.body.userName,
          phone: req.body.phone,
          email: req.body.email,
        },
      },
      {
        new: true,
      }
    );
    if (!user) return res.status(400).send("Unable to update User");
    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
