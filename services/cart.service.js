
const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId, isDeleted: false });

  if (!cart) {
    cart = await Cart.create({ userId });
  }

  return cart;
};

exports.getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  const items = await CartItem.find({ cartId: cart._id }).populate(
    "productId",
    "name price stock",
  );

  return {
    cart,
    items,
  };
};

exports.addCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await getOrCreateCart(userId);

  let cartItem = await CartItem.findOne({ cartId: cart._id, productId });

  if (cartItem) {
    cartItem.quantity += quantity;
    cartItem.price = product.price;
  } else {
    cartItem = new CartItem({
      cartId: cart._id,
      productId,
      quantity,
      price: product.price,
    });
  }

  await cartItem.save();

  return await exports.getCart(userId);
};

exports.updateCartItem = async (userId, itemId, quantity) => {
  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cart = await getOrCreateCart(userId);

  const cartItem = await CartItem.findOne({ _id: itemId, cartId: cart._id });
  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return await exports.getCart(userId);
};

exports.removeCartItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);

  const cartItem = await CartItem.findOne({ _id: itemId, cartId: cart._id });
  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  await cartItem.deleteOne();

  return await exports.getCart(userId);
};

exports.clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);

  await CartItem.deleteMany({ cartId: cart._id });

  return this.getCart(userId);
};