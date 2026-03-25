const mongoose = require("mongoose");
const productService = require("../services/product.service");

const getProducts = async (req, res) => {
  const data = await productService.getProduct(req.query);

  return res.status(200).json({
    success: true,
    message: "Product fetch successfully",
    pagination: data.pagination,
    data: data.products,
  });
};

const createProduct = async (req, res) => {
  const data = await productService.createProduct(req);

  return res.status(200).json({
    success: true,
    message: "Product created successfully!",
    data,
  });
};

module.exports = {
  getProducts,
  createProduct,
};
