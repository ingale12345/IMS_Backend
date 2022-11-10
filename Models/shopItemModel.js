const { Schema, Types, model } = require("mongoose");
const { shopSchema } = require("./shopModel");

const shopItemSchema = new Schema({
  shop: {
    type: Types.ObjectId,
    required: true,
  },
  item: {
    type: Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantityAddition: [
    {
      amount: Number,
      unit: String,
      date: {
        type: Date,
        default: new Date(),
      },
      addedBy: {
        type: Types.ObjectId,
        required: true,
      },
      _id: false,
    },
  ],
  availableQuantity: {
    _id: false,
    type: {
      amount: Number,
      unit: String,
    },
    required: true,
  },
});

const ShopItem = model("shopitem", shopItemSchema);
module.exports.shopItemSchema = shopItemSchema;
module.exports.ShopItem = ShopItem;
