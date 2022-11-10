const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "category name should not be less than 3 letters"],
    maxLength: [50, "category name should not be greater than 50 letters"],
  },
  profile: {
    image: {
      type: Buffer,
    },
    imageName: String,
    mimetype: String,
  },
});

const Categories = mongoose.model("categories", categoriesSchema);

module.exports.Categories = Categories;
module.exports.categoriesSchema = categoriesSchema;
