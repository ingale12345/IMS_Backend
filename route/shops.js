const express = require("express");
const { default: mongoose } = require("mongoose");
const { Categories } = require("../Models/categoriesModel");
const { ItemClass, itemClassesSchema } = require("../Models/itemClassModel");
const { Item } = require("../Models/itemModel");
const { ShopItem } = require("../Models/shopItemModel");
const router = express.Router();
const { Shop, shopSchema } = require("../Models/shopModel");
const { User } = require("../Models/userModel");
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

//____________________Changes__________________
router.get("/shopscategory/data", async (req, res) => {
  const categories = await Categories.find();
  const shops = await Shop.find();
  let categorywiseShops = {};
  categories.forEach((category) => {
    categorywiseShops[category._id] = [];
    shops.forEach((shop) => {
      if (shop.category.equals(category._id)) {
        categorywiseShops[category._id].push(shop);
      }
    });
  });

  res.send(categorywiseShops);
});

router.post("/shopsbycategory", async (req, res) => {
  console.log(req.body.categoryId);
  const shops = await Shop.find({ category: req.body.categoryId });
  res.send(shops);
});

router.post("/shopdata", async (req, res) => {
  const shopId = req.body.shopId;
  let shopData = {};
  console.log(shopId);
  //shopItems
  const shopItems = await ShopItem.find({ shop: shopId });
  const allItems = await Item.find();

  //Items
  const items = [];
  shopItems.forEach((shopItem) => {
    allItems.forEach((item) => {
      if (item._id.equals(shopItem.item)) {
        items.push(item);
      }
    });
  });

  //ItemClasses
  const shop = await Shop.findById(shopId);
  const allItemClasses = await ItemClass.find(
    { category: shop?.category },
    { name: 1 }
  );

  let itemClasses = [];
  allItemClasses.map((itemClass) => {
    const item = items.filter((item) => {
      return itemClass._id.equals(item.itemClass);
    });

    if (item.length != 0) {
      itemClasses.push({
        itemClass: itemClass.name,
        noOfItems: item.length,
        item: item,
      });
    }
  });

  shopData = {
    shopItems: shopItems,
    shopName: shop.name,
    itemClasses: itemClasses,
  };
  res.send(shopData);
});

module.exports = router;
