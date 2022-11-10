const express = require("express");
const { Categories } = require("../Models/categoriesModel");
const router = express.Router();
const fs = require("fs");
const sharp = require("sharp");
const { ItemClass, itemClassesSchema } = require("../Models/itemClassModel");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/", upload.single("profile"), async (req, res) => {
  const img = fs.readFileSync(
    "D:\\Mudik_Trainee\\NODE JS\\Inventory\\NoImage.jpg"
  );

  const category = await Categories.findById(req.body.category);
  if (!category)
    return res.status(404).send("Category is not found with given id");
  const itemClass = new ItemClass({
    name: req.body.name,
    category: req.body.category,
    profile: {
      image: await sharp(req.file?.buffer || img)
        .resize({ width: 250, height: 250 })
        .toBuffer(),
      imageName: Date.now() + "-" + req.file?.originalname || "NoImage.jpg",
      mimetype: req.file?.mimetype || "image/jpg",
    },
  });
  try {
    const result = await itemClass.save();
    // console.log(result);
    // console.log("Item Class Successfully saved into database");
    res.status(200).send(itemClass);
  } catch (error) {
    console.log(error);
  }
});
router.get("/", async (req, res) => {
  try {
    const itemClasses = await ItemClass.find({});
    if (itemClasses.length === 0)
      return res.status(404).send("ItemClasses not found");
    return res.status(200).send(itemClasses);
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const itemClass = await ItemClass.find({
      $or: [{ name: regEx }],
    });
    res.send(itemClass);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const itemClass = await ItemClass.findById(req.params.id);
    if (!itemClass)
      return res.status(404).send("Item class Is not found with given id");
    return res.status(200).send(itemClass);
  } catch (error) {
    console.log(error);
  }
});
router.put("/:id", upload.single("profile"), async (req, res) => {
  try {
    let itemClass;
    if (!req.file) {
      itemClass = await ItemClass.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            category: req.body.category,
          },
        },
        {
          new: true,
        }
      );
    } else {
      itemClass = await ItemClass.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            category: req.body.category,
            profile: {
              image: req.file.buffer,
              imageName: Date.now() + "-" + req.file.originalname,
              mimetype: req.file.mimetype,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    if (!itemClass) return res.status(400).send("itemClass not found");
    return res.status(200).send(itemClass);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const itemClass = await ItemClass.findByIdAndDelete(req.params.id);
    if (!itemClass)
      return res
        .status(404)
        .send("Not able to delete/Itemclass is not found with given id");
    return res.status(200).send(itemClass);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
