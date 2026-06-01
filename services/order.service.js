const Order = require("../models/order.model");
const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");
const CartItem = require("../models/cartItem.model");
const User = require("../models/user.model");
const Address = require("../models/address.model");

exports.getOrder = async (userId) => {
  const data = await Order.find({ userId }).lean();
  return data;
};

/*
Steps:
1.	validate cart
2.	check inventory
3.	create order
4.	create order_items
5.	reduce stock
6.	clear cart
*/
exports.createOrder = async (payload) => {
  const userId = payload.user?._id;

  // orderNumber;
  // subtotal;
  // totalAmount;

  if (!mongoose.Types.ObjectId(userId)) {
    throw new ApiError(404, "Userid is not proper");
  }
  const user = await User.find(userId);
  if (!user) {
    throw new ApiError(404, "User is not found");
  }


  if (!mongoose.Types.ObjectId(addressId)) {
    throw new ApiError(404, "addressId is not proper");
  }

  const address = await Address.find(addressId);
  if (!address) {
    throw new ApiError(404, "Address is not found");
  }

  const result = {
    userId: userId,
  };
  return result;
};
