const express = require("express");
const router = express.Router();

const { Categories } = require("../Models/categoriesModel");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");
router.post("/", upload.single("profile"), async (req, res) => {
  const img = fs.readFileSync("D://project_Backend//NoImage.jpg");
  const category = new Categories({
    name: req.body.name,
    profile: {
      image: req.file?.buffer || img,
      imageName: Date.now() + "-" + req.file?.originalname || "NoImage.jpg",
      mimetype: req.file?.mimetype || "image/jpg",
    },
  });
  try {
    const result = await category.save();
    console.log("category Saved into database");
    return res.status(200).send(result);
  } catch (error) {
    console.log("Unable to save Category Into database==>" + error);
  }
});
router.post("/search", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const categories = await Categories.find({
      $or: [{ name: regEx }],
    });
    res.send(categories);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const categories = await Categories.find({});
    if (categories.length > 0) return res.status(200).send(categories);
    return res.status(404).send("Categories Not Found");
  } catch (error) {
    console.log("Unbale to Fetch categories" + error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    if (!category) return res.status(404).send("Category Not Found");
    return res.status(200).send(category);
  } catch (error) {
    console.log("Unbale to Fetch categories" + error);
  }
});
router.put("/:id", upload.single("profile"), async (req, res) => {
  try {
    let category;

    if (!req.file) {
      category = await Categories.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
          },
        },
        {
          new: true,
        }
      );
    } else {
      category = await Categories.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
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

    if (!category) return res.status(400).send("category not found");
    return res.status(200).send(category);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const result = await Categories.findByIdAndDelete(req.params.id);
    if (!result)
      return res
        .status(404)
        .send("Unable to Delete Category or Category Not found");
    return res.status(200).send(result);
  } catch (error) {
    console.log("Unable to delete Category==>" + error);
  }
});

router.post("/count", async (req, res) => {
  const { title } = req.body;

  // console.log({ title, genre });
  let query = {};

  // console.log(query);
  if (!title) {
    let categories = await Categories.find(query);

    return res.send(categories.length + "");
  }
  query["name"] = new RegExp(`^${title}`, "i");
  const totalNoOfCategories = await Categories.find(query).countDocuments();
  res.status(200).send(totalNoOfCategories + "");
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

  let categories = await Categories.find(query).limit(limit).skip(skip);
  // console.log({ movies });
  res.send(categories);
});
module.exports = router;
