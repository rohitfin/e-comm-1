const Inventory = require("../models/inventory.model");
const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");

exports.getInventoryByProduct = async (req) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const data = await Inventory.find({ productId }).lean();

  if (!data || data.length === 0) {
    throw new ApiError(404, "Inventory not found");
  }

  return data;
};

exports.updateInventory = async (req) => {
  const productId = req.params.id;
  const body = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const result = await Inventory.findOneAndUpdate(
    { productId: productId },
    { $set: body },
    { new: true, runValidators: true },
  );

  return result;
};

exports.getLowStock = async (req) => {
  let number = req.params.number
  number = parseInt(number);
  if (isNaN(number)) number = 90;

  const result = await Inventory.find({
    stock: { $lte: number },
  }).lean();

  return result;
};
