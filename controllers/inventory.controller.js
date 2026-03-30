const mongoose = require("mongoose");
const inventory = require("../services/inventory.service");

const getInventoryByProduct = async (req, res) => {
  const data = await inventory.getInventoryByProduct(req);

  return res.status(200).json({
    success: true,
    message: "Inventory fetch successfully",
    data,
  });
};

const updateInventory = async (req, res) => {
  const data = await inventory.updateInventory(req);

  return res.status(200).json({
    success: true,
    message: "Inventory Update successfully",
    data,
  });
};

const getLowStock = async (req, res) => {
  const data = await inventory.getLowStock(req);

  return res.status(200).json({
    success: true,
    message: "Low stock inventory fetch successfully",
    data
  })
};

module.exports = { getInventoryByProduct, updateInventory, getLowStock };
