const mongoose = require("mongoose");

const itemClassesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "length of ItemClassName should not be less than 3"],
    maxLength: [20, "length off ItemClassName should not be greater than 20"],
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  profile: {
    image: {
      type: Buffer,
    },
    imageName: String,
    mimetype: String,
  },
});
const ItemClass = mongoose.model("itemclasses", itemClassesSchema);
module.exports.itemClassesSchema = itemClassesSchema;
module.exports.ItemClass = ItemClass;
