const express = require("express");
const router = express.Router();
const { Requisition } = require("../Models/requisitionModel");
const { ShopItem } = require("../Models/shopItemModel");
const { Shop, shopSchema } = require("../Models/shopModel");
router.get("/", async (req, res) => {
  try {
    const requisitions = await Requisition.find({});
    if (requisitions.length === 0)
      return res.status(404).send("Requisitions are not found");
    res.status(200).send(requisitions);
  } catch (error) {
    console.log(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id);
    if (!requisition)
      return res.status(404).send("Requisition is not found with given ID");
    res.status(200).send(requisition);
  } catch (error) {
    console.log(error);
  }
});
router.put("/shop/:id", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const shopItemsByShop = await ShopItem.find({ shop: req.params.id });
    let requisitions = await Requisition.find({
      $and: [{ status: regEx }, { status: { $ne: "created" } }],
    });
    requisitions = requisitions.filter((requisition) => {
      let available = false;
      shopItemsByShop.forEach((shopItem) => {
        if (shopItem._id.toString() == requisition.shopItem.toString()) {
          available = true;
        }
      });
      return available;
    });
    return res.status(200).send(requisitions);
  } catch (err) {
    console.log(err);
  }
});
router.post("/search", async (req, res) => {
  try {
    const regEx = new RegExp(`^${req.body.searchValue}`, "i");
    const requisitions = await Requisition.find({
      $or: [{ status: regEx }],
    });
    res.send(requisitions);
  } catch (error) {
    console.log(error);
  }
});
router.post("/", async (req, res) => {
  function randomString(length) {
    let chars =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for (var i = length; i > 0; --i)
      result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  try {
    const shopItem = await ShopItem.findById(req.body.shopItem);
    if (!shopItem)
      return res.status(400).send("Shop item is not found with given id");
    const shop = await Shop.findById(shopItem.shop);
    if (!shop) return res.status(400).send("shop is not found with given id");
    const requisitionNumber = shop.shopId + randomString(4);

    const requisition = new Requisition({
      shopItem: req.body.shopItem,
      requiredQuntity: req.body.requiredQuntity,
      customer: req.body.customer,
      requisitionNumber: requisitionNumber,
      status: "created",
      preferredDeliveryDate: new Date(req.body.preferredDeliveryDate),
    });
    const result = await requisition.save();
    if (!result) return res.status(400).send("Unable to save requisition");
    res.status(200).send(requisition);
  } catch (err) {
    console.log(err);
  }
});
router.put("/:id", async (req, res) => {
  const result = await Requisition.findByIdAndUpdate(
    req.body.reqId,
    {
      $inc: { "requiredQuntity.amount": req.body.updateValue },
    },
    {
      new: true,
    }
  );
  if (result.requiredQuntity.amount === 0) {
    await Requisition.findByIdAndDelete(result._id);
  }
  res.status(200).send(result);
});

router.patch("/:id", async (req, res) => {
  const requisition = await Requisition.findById(req.params.id);
  if (!requisition)
    return res.status(404).send("Requisition with given id is not found");
  if (req.body.status === "placed") {
    requisition.status = req.body.status;
  }
  if (req.body.status === "dispatched") {
    const session = await Requisition.startSession();
    session.startTransaction();
    try {
      const shopItem = await ShopItem.findById(requisition.shopItem);
      const diff =
        +shopItem.availableQuantity.amount -
        +requisition.requiredQuntity.amount;
      if (diff < 0) {
        res.status(404).send("provided Item Quantity Is not available");
        await session.commitTransaction();
        return;
      }
      shopItem.availableQuantity.amount = diff + "";
      requisition.status = req.body.status;
      await requisition.save();
      await shopItem.save();
      res.status(200).send(requisition);
      await session.commitTransaction();
      console.log("Transation completed ");
      return;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    }
  }
  if (req.body.status === "cancelled") {
    if (requisition.status === "dispatched") {
      requisition.status = "dispatched";
      return res.status(400).send("Requisition is accepted . unable to cancel");
    } else {
      requisition.status = req.body.status;
      // requisition.cancellationReason = req.body.cancellationReason;
    }
  }
  // if (req.body.status === "dispatched") {
  //   requisition.status = req.body.status;
  // }
  await requisition.save();
  res.status(200).send(requisition);
});
router.delete("/:id", async (req, res) => {
  try {
    const requisition = await Requisition.findByIdAndDelete(req.params.id);
    if (!requisition)
      return res.status(400).send("Unable to delete requisition with given id");
    res.status(200).send(requisition);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
