const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

cartItemSchema.index({ cartId: 1, productId: 1 }, { unique: true });

const CartItem = mongoose.model("CartItem", cartItemSchema, "tbl_cart_items");

module.exports = CartItem;
