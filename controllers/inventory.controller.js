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

module.exports = { getInventoryByProduct };
