const express = require("express");
const { ItemClass } = require("../Models/itemClassModel");
const router = express.Router();
const { Item, itemSchema } = require("../Models/itemModel");
const fs = require("fs");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/", upload.single("profile"), async (req, res) => {
  const img = fs.readFileSync("D://project_Backend//NoImage.jpg");
  const itemClass = await ItemClass.findById(req.body.itemClass);
  if (!itemClass)
    return res.status(404).send("Item Class is not found with given id");
  const item = new Item({
    name: req.body.name,
    itemClass: req.body.itemClass,
    description: req.body.description,
    profile: {
      image: req.file?.buffer || img,
      imageName: Date.now() + "-" + req.file?.originalname || "NoImage.jpg",
      mimetype: req.file?.mimetype || "image/jpg",
    },
  });
  try {
    const result = await item.save();
    if (!result)
      return res.status(400).send("Not able to save Item / Somthing failed");
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({});
    if (items.length === 0)
      return res.status(404).send("Items  are  not found");
    return res.status(200).send(items);
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const items = await Item.find({
      $or: [{ name: regEx }],
    });
    res.send(items);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send("Item is not found with given Id");
    return res.status(200).send(item);
  } catch (error) {
    console.log(error);
  }
});
router.put("/:id", upload.single("profile"), async (req, res) => {
  try {
    let item;
    if (!req.file) {
      item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            itemClass: req.body.itemClass,
            description: req.body.description,
          },
        },
        {
          new: true,
        }
      );
    } else {
      item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            itemClass: req.body.itemClass,
            description: req.body.description,
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
    if (!item) return res.status(400).send("item not found");
    return res.status(200).send(item);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .send("Unable to delete Item/Item is not found with given id");
    return res.status(200).send(item);
  } catch (error) {
    console.log(error);
  }
});

router.post("/count", async (req, res) => {
  const { title } = req.body;

  // console.log({ title, genre });
  let query = {};

  // console.log(query);
  if (!title) {
    let items = await Item.find(query);

    return res.send(items.length + "");
  }
  query["name"] = new RegExp(`^${title}`, "i");
  const totalNoOfItems = await Item.find(query).countDocuments();
  res.status(200).send(totalNoOfItems + "");
});

router.post("/pfs", async (req, res) => {
  const { pageSize, currentPage, title } = req.body;

  let skip = 0;
  let limit = 0;
  let query = {};
  if (pageSize && currentPage) {
    skip = (currentPage - 1) * pageSize;
    limit = pageSize;
  }

  if (title) {
    query["name"] = new RegExp(`^${title}`, "i");
  }

  let items = await Item.find(query).limit(limit).skip(skip);
  // console.log({ movies });
  res.send(items);
});
module.exports = router;
