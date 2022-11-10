const { model, Schema, Types } = require("mongoose");

const requisitionSchema = new Schema({
  shopItem: {
    type: Types.ObjectId,
    required: true,
  },
  customer: {
    type: Types.ObjectId,
    required: true,
  },
  requiredQuntity: {
    type: {
      amount: Number,
      unit: String,
    },
    required: true,

    _id: false,
  },
  preferredDeliveryDate: {
    type: Date,
    default: new Date(),
  },
  requisitionNumber: {
    type: String,
    minLength: [12, "Requisition Number Should not be less than 12"],
    maxLength: [12, "Requisition Number Should not be greater than 12"],
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["created", "placed", "accepted", "cancelled", "dispatched"],
      message: "Invalid Status! use[created, accepted,cancelled,dispatched]",
    },
  },
  cancellationReason: {
    type: String,
    default: "Not Cancelled",
    required: true,
  },
});

const Requisition = model("requisition", requisitionSchema);
module.exports.Requisition = Requisition;
module.exports.requisitionSchema = requisitionSchema;
