const { model, Schema, Types } = require("mongoose");

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Item Name should not be lass than 3 letters"],
    maxLength: [20, "Item Name should not be greater than 20 letters"],
  },
  itemClass: {
    type: Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [3, "description should not be less than 3 letters"],
    maxLength: [100, "description should not be greater than 100 letters"],
  },
  profile: {
    image: {
      type: Buffer,
    },
    imageName: String,
    mimetype: String,
  },
});

const Item = model("item", itemSchema);
module.exports.Item = Item;
module.exports.itemSchema = itemSchema;
