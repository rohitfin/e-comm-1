const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const User = require("../models/user.model");
const Address = require("../models/address.model");
const Inventory = require("../models/inventory.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItems.model");

exports.getOrder = async (userId) => {
  const data = await Order.find({ userId }).lean();
  return data;
};

exports.createOrder = async (req) => {
  const userId = req.user?._id;
  const { cartItemIds, paymentMethod, addressId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(400, "Invalid addressId");
  }

  if (!cartItemIds || cartItemIds.length === 0) {
    throw new ApiError(400, "Cart items are required");
  }

  const validPaymentMethods = ["COD", "UPI", "CARD"];

  if (!validPaymentMethods.includes(paymentMethod)) {
    throw new ApiError(400, "Invalid payment method");
  }

  const user = await User.findById(userId).lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const address = await Address.findById(addressId).lean();

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  if (String(address.userId) !== String(userId)) {
    throw new ApiError(403, "Address does not belong to user");
  }

  let subTotal = 0;
  let totalAmount = 0;

  const orderItemPayload = [];

  for (const cartItemId of cartItemIds) {
    const cartItem = await CartItem.findById(cartItemId).lean();

    if (!cartItem) {
      throw new ApiError(404, "Cart item not found");
    }

    const cart = await Cart.findById(cartItem.cartId).lean();

    if (!cart) {
      throw new ApiError(404, "Cart not found");
    }

    if (String(cart.userId) !== String(userId)) {
      throw new ApiError(403, "Cart item does not belong to user");
    }

    const inventory = await Inventory.findOne({
      productId: cartItem.productId,
    }).lean();

    if (!inventory) {
      throw new ApiError(404, "Inventory not found");
    }

    if (inventory.stock < cartItem.quantity) {
      throw new ApiError(400, "Insufficient stock");
    }

    const lineTotal = cartItem.price * cartItem.quantity;

    subTotal += lineTotal;
    totalAmount += lineTotal;

    orderItemPayload.push({
      cartItemId: cartItem._id,
      productId: cartItem.productId,
      productName: cartItem.productName,
      productImage: cartItem.productImage,
      price: cartItem.price,
      quantity: cartItem.quantity,
      totalPrice: lineTotal,
    });
  }

  const orderNumber = `ORD-${Date.now()}`;

  const order = await Order.create({
    userId,
    addressId,
    orderNumber,
    paymentMethod,
    subTotal,
    totalAmount,
  });

  orderItemPayload.forEach((item) => {
    item.orderId = order._id;
    delete item.cartItemId;
  });

  const orderItems = await OrderItem.insertMany(orderItemPayload);

  for (const item of orderItemPayload) {
    await Inventory.updateOne(
      {
        productId: item.productId,
      },
      {
        $inc: {
          stock: -item.quantity,
        },
      },
    );
  }

  await CartItem.deleteMany({
    _id: { $in: cartItemIds },
  });

  return {
    orderId: order._id,
    orderNumber: order.orderNumber,
    status: order.orderStatus,
    paymentMethod: order.paymentMethod,
    subTotal,
    totalAmount,
    items: orderItems,
  };
};
