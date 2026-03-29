const Inventory = require("../models/inventory.model");
const ApiError = require("../utils/apiError");
const mongoose = require("mongoose");


exports.getInventoryByProduct = async (req) => {
  const productId = req.params.id;

  const raw = await Inventory.collection.find({
  productId: new mongoose.Types.ObjectId(productId)
}).toArray();

console.log("RAW DATA:", raw);

  console.log("API ProductId:", productId);

  const data = await Inventory.find({ productId });
  console.log("DB Result:", data);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  //   const data = await Inventory.find({
  //     productId: new mongoose.Types.ObjectId(productId),
  //   });

  //   const data = await Inventory.find({}).lean();

  if (!data || data.length === 0) {
    throw new ApiError(404, "Inventory not found");
  }

  return data;
};