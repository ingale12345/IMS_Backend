const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: true,
    maxLength: [8, "Length of shop id should not be greater than 8 letters"],
  },
  addressLine1: {
    type: String,
    required: true,
    minLength: [5, "length of AddressLine 1 should not less than 5 letters"],
    maxLength: [
      50,
      "length of AddressLine1 should not be greater than 50 letters",
    ],
  },
  addressLine2: {
    type: String,
    required: true,
    minLength: [5, "length of AddressLine2 should not less than 5 letters"],
    maxLength: [
      50,
      "length of AddressLine2 should not be greater than 50 letters",
    ],
  },
  area: {
    type: String,
    required: true,
    minLength: [5, "length of AddressLine2 should not less than 5 letters"],
    maxLength: [
      50,
      "length of AddressLine2 should not be greater than 50 letters",
    ],
  },
  city: {
    type: String,
    required: true,
    minLength: [3, "length of AddressLine2 should not less than 3 letters"],
    maxLength: [
      20,
      "length of AddressLine2 should not be greater than 20 letters",
    ],
  },
  state: {
    type: String,
    required: true,
    minLength: ["2", "Length of state should not be less than 2 letters"],
    maxLength: ["20", "Length of state should not greater than 20 letterss"],
  },
  zipcode: {
    type: String,
    required: true,
    minLength: [6, "length of zipcode should not be less than 6"],
    maxLength: [6, "length of zipcode should not be greater than 6"],
  },
  category: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  contactPerson: {
    name: { type: String },
    phone: {
      type: String,
      minLength: [10, "Phone number should not be less than 10"],
      maxlength: [10, "Phone number should not be greater than 10"],
    },
  },
});

const Shop = mongoose.model("shop", shopSchema);

module.exports.shopSchema = shopSchema;
module.exports.Shop = Shop;
