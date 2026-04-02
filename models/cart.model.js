const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdIP: { type: String, default: null },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1 });

const Cart = mongoose.model("Cart", cartSchema, "tbl_carts");

module.exports = Cart;