const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const User = require("../models/user.model");
const mongoose = require("mongoose");

exports.getCart = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const cart = await Cart.findOne({ userId, isDeleted: false });

  if (!cart) {
    throw new ApiError(404, "Cart not found for user");
  }

  const cartItems = await CartItem.find({ cartId: cart._id })
    .populate("productId", "name price")
    .lean();

  if (!cartItems.length) {
    throw new ApiError(404, "No cart items found");
  }

  const mappedItems = cartItems
    .filter((item) => item.productId)
    .map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      subTotal: item.quantity * item.price,
    }));

  // const total = mappedItems.reduce((acc, ele) => acc + ele.subtotal, 0);
  const total = cartItems.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  return {
    item: mappedItems,
    total,
  };
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
    isDeleted: false,
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  const deletedItem = await CartItem.findByIdAndUpdate(
    itemId,
    { isDeleted: true },
    { new: true },
  );

  return deletedItem;
};

exports.clearCart = async (any) => {
  return {};
};

exports.getCartTotal = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid userId");
  }

  const cart = await Cart.findOne({
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();

  if (!cart) {
    throw new ApiError(404, "Cart is not found");
  }

  const cartItems = await CartItem.find({
    cartId: cart._id,
  })
    .populate("productId", "name price")
    .lean();

  if (cartItems.length === 0) {
    throw new ApiError(404, "Cart Items not found");
  }

  const items = cartItems.map((item) => {
    const subTotal = item.productId.price * item.quantity;

    return {
      itemId: item._id,
      productId: item.productId._id,
      productName: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      subTotal,
    };
  });

  const subTotal = items.reduce((acc, item) => acc + item.subTotal, 0);

  const tax = 0;

  const grandTotal = subTotal + tax;

  return {
    items,
    summary: {
      subTotal,
      tax,
      grandTotal,
    },
  };
};

exports.getAdminCartTotal1 = async () => {
  const carts = await Cart.find().lean();

  if (carts.length === 0) {
    throw new ApiError(404, "Carts not found");
  }

  const users = await Promise.all(
    carts.map(async (cart) => {
      const cartItems = await CartItem.find({
        cartId: cart._id,
      })
        .populate("productId", "name price")
        .lean();

      const items = cartItems
        .filter((item) => item.productId)
        .map((item) => {
          const itemSubTotal = item.productId.price * item.quantity;

          return {
            itemId: item._id,

            productId: item.productId._id,
            productName: item.productId.name,

            price: item.productId.price,
            quantity: item.quantity,

            subTotal: itemSubTotal,
          };
        });

      // USER SUMMARY

      const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

      const subTotalItems = items.reduce((acc, item) => acc + item.subTotal, 0);

      const taxItems = 0;

      const grandTotalItems = subTotalItems + taxItems;

      return {
        userId: cart.userId,

        items,

        summary: {
          totalItems,
          subTotalItems,
          taxItems,
          grandTotalItems,
        },
      };
    }),
  );

  // OVERALL SUMMARY

  const totalUser = users.length;

  const subTotal = users.reduce(
    (acc, user) => acc + user.summary.subTotalItems,
    0,
  );

  const tax = users.reduce((acc, user) => acc + user.summary.taxItems, 0);

  const grandTotal = users.reduce(
    (acc, user) => acc + user.summary.grandTotalItems,
    0,
  );

  return {
    users,

    summary: {
      totalUser,
      subTotal,
      tax,
      grandTotal,
    },
  };
};

exports.getAdminCartTotal = async (req, res) => {
  const carts = await Cart.find().lean();

  if (!carts) {
    throw new ApiError(400, "Cart is not found");
  }

  const users = await Promise.all(
    carts.map(async (cart) => {
      let cartItem = await CartItem.find({
        cartId: cart._id,
      })
        .populate("productId", "name price")
        .lean();

      let items = await cartItem.map((item) => {
        const subTotal = item.productId.price * item.quantity;
        // const tax = (item.productId.price * item.tax)/100;

        return {
          itemId: item._id,

          productId: item.productId._id,
          productName: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,

          subTotal,
        };
      });

      const subTotalItem = items.reduce((acc, ele, ind, arr) => {
        return acc + ele.subTotal;
      }, 0);
      const taxItem = 0;
      const grandTotalItem = subTotalItem + taxItem;

      return {
        userId: cart.userId,
        items,
        summary: {
          subTotalItem,
          taxItem,
          grandTotalItem,
        },
      };
    }),
  );

  const subTotal = users.reduce((acc, ele, ind, arr) => {
    return acc + ele.summary.subTotalItem;
  }, 0);
  const total = users.reduce((acc, ele, ind, arr) => {
    return acc + ele.summary.totalItem;
  }, 0);
  const tax = users.reduce((acc, ele, ind, arr) => {
    return acc + ele.summary.taxItem;
  }, 0);
  const grandTotal = total + tax;

  return {
    users,
    summary: {
      subTotal,
      total,
      tax,
      grandTotal,
    },
  };
};
