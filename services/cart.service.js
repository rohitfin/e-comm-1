const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");

exports.getCart = async (any) => {
  return {};
};

exports.addCart = async (userId, productId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid productId");
  }

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ userId, isDeleted: false });

  if (!cart) {
    cart = await Cart.create({ userId });
  }

  const existingItem = await CartItem.findOne({
    cartId: cart._id,
    productId,
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();

    return existingItem;
  }

  const newItem = await CartItem.create({
    cartId: cart._id,
    productId,
    quantity,
    price: product.price,
  });

  return newItem;
};

exports.getCart = async (any) => {
  return {};
};

exports.updateCartItem = async (userId, itemId, quantity) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid itemId");
  }

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than 0");
  }

  const cart = await Cart.findOne({ userId, isDeleted: false });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const cartItem = await CartItem.findOne({
    _id: itemId,
    cartId: cart._id,
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return cartItem;
};

exports.getCart = async (any) => {
  return {};
};
exports.removeCartItem = async (userId, itemId) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid itemId");
  }

  const cart = await Cart.findOne({ userId, isDeleted: false });

  if (!cart) {
    throw new ApiError(404, "Cart not found for user");
  }

  const cartItem = await CartItem.findOne({
    _id: itemId,
    cartId: cart._id,
    isDeleted: false
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  const deletedItem = await CartItem.findByIdAndUpdate(
    itemId,
    { isDeleted: true },
    { new: true }
  );

  return deletedItem;
};
exports.getCart = async (any) => {
  return {};
};
exports.clearCart = async (any) => {
  return {};
};
