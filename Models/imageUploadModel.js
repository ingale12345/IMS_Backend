const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userImageSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    profileImg: {
      type: String,
    },
  },
  {
    collection: "UserImages",
  }
);
module.exports = mongoose.model("UserImage", userImageSchema);
