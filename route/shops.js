const express = require("express");
const { default: mongoose } = require("mongoose");
const { Categories } = require("../Models/categoriesModel");
const router = express.Router();
const { Shop, shopSchema } = require("../Models/shopModel");
const { User } = require("../Models/userModel");

router.post("/count", async (req, res) => {
  const { title, owner } = req.body;
  let query = {};
  query["owner"] = owner;
  if (title) {
    const regex = new RegExp(`^${title}`, "i");
    query["name"] = regex;
  }
  const totalNoOfShops = await Shop.find(query).count();
  res.status(200).send(totalNoOfShops + "");
});

router.get("/byShopOwner/:id", async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.params.id });
    if (shops.length === 0)
      return res.status(400).send("Shop is not found with given Id");
    res.status(200).send(shops);
  } catch (error) {
    console.log(error);
  }
});

router.post("/PFS/", async (req, res) => {
  const { pageSize, currentPage, title, owner } = req.body;
  let skip = 0;
  let limit = 0;
  let query = { owner };
  if (title) {
    const regex = new RegExp(`^${title}`, "i");
    query["name"] = regex;
  }
  if (pageSize && currentPage) {
    skip = (currentPage - 1) * pageSize;
    limit = pageSize;
  }
  const shops = await Shop.find(query).skip(skip).limit(limit);
  res.status(200).send(shops);
});

router.post("/", async (req, res) => {
  function randomString(length) {
    let chars = "0123456789";
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  const category = await Categories.findById(req.body.category);
  if (!category)
    return res.status(404).send("Category is not found with given id");
  const user = await User.findById(req.body.owner);
  if (!user)
    return res.status(404).send("Owner/ User is not found wiht given id");
  const shopId = req.body.name.substring(0, 4).toUpperCase() + +randomString(4);
  const shop = new Shop({
    name: req.body.name,
    shopId: shopId,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    area: req.body.area,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zipcode,
    category: req.body.category,
    owner: req.body.owner,
    contactPerson: req.body.contactPerson,
  });
  try {
    const result = await shop.save();
    if (!shop) return res.status(400).send("somthing failed");
    console.log("shop saved into database");
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find({});
    if (shops.length <= 0) return res.status(404).send("Shops not Found");
    return res.status(200).send(shops);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:id", async (req, res) => {
  const category = await Categories.findById(req.body.category);
  if (!category)
    return res.status(404).send("Category is not found with given id");
  const user = await User.findById(req.body.owner);
  if (!user)
    return res.status(404).send("Owner/ User is not found wiht given id");
  const shopId =
    req.body.name.substring(0, 4).toUpperCase() +
    Math.floor(Math.random() * 10000);
  const shop = await Shop.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        shopId: shopId,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLine2,
        area: req.body.area,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        category: req.body.category,
        contactPerson: req.body.contactPerson,
      },
    },
    {
      new: true,
    }
  );

  if (!shop) return res.status(400).send("Unable to Update Shop");
  return res.status(200).send(shop);
});

router.post("/search", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const shops = await Shop.find({
      $or: [{ name: regEx }],
    });
    res.send(shops);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).send("Shop not Found wit given ID");
    return res.status(200).send(shop);
  } catch (error) {
    console.log(error);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const result = await Shop.findByIdAndDelete(req.params.id);
    if (!result)
      return res
        .status(404)
        .send("Shop not found with given ID /Not able to delete");
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
