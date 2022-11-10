const express = require("express");
const { Item } = require("../Models/itemModel");
const router = express.Router();
const { shopItemSchema, ShopItem } = require("../Models/shopItemModel");
const { Shop } = require("../Models/shopModel");

router.get("/", async (req, res) => {
  try {
    const shopItems = await ShopItem.find({});
    if (shopItems.length === 0)
      return res.status(404).send("Shop Items are not found");
    res.status(200).send(shopItems);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const shopItem = await ShopItem.findById(req.params.id);
    if (!shopItem)
      return res.status(400).send("ShopItem is not found with given Id");
    res.status(200).send(shopItem);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  const shop = await Shop.findById(req.body.shop);
  if (!shop) return res.status(400).send("Shop is not found with given Id");
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(400).send("shop is not found with given Id");
  const shopItem = new ShopItem({
    shop: req.body.shop,
    item: req.body.item,
    price: req.body.price,
    quantityAddition: [
      {
        amount: req.body.quantityAddition.amount,
        unit: req.body.quantityAddition.unit,
        date: Date.now(),
        addedBy: req.body.quantityAddition.addedBy,
      },
    ],
    availableQuantity: {
      amount: req.body.quantityAddition.amount,
      unit: req.body.quantityAddition.unit,
    },
  });
  try {
    const result = await shopItem.save();
    if (!result)
      return res.status(400).send("Unbale to save shopItem into Database");
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const shopItem = await ShopItem.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          price: +req.body.price,
        },
      },
      { new: true }
    );

    if (!shopItem) return res.status(400).send("unable to update price");
    return res.status(200).send(shopItem);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  const previousShopItem = await ShopItem.findById(req.params.id);
  if (!previousShopItem)
    return res.status(400).send("Shop Item with Given Id is not found ");
  const updatedShopItem = await ShopItem.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        quantityAddition: {
          amount: req.body.quantityAddition.amount,
          unit: req.body.quantityAddition.unit,
          date: Date.now(),
          addedBy: req.body.quantityAddition.addedBy,
        },
      },
      availableQuantity: {
        amount:
          +previousShopItem.availableQuantity.amount +
          +req.body.quantityAddition.amount,
        unit: req.body.quantityAddition.unit,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).send(updatedShopItem);
});
router.delete("/:id", async (req, res) => {
  try {
    const shopItem = await ShopItem.findByIdAndDelete(req.params.id);
    if (!shopItem)
      return res
        .status(400)
        .send("Not able to delete/shopItem is not found with given id");
    return res.status(200).send(shopItem);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
