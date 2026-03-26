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

const getProductSearch = async (req, res) => {
  const data = await productService.getProductSearch(req.query);

  return res.status(200).json({
    success: true,
    message: "Product fetch successfully",
    data,
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

const getProductsDetail = async(req, res)=>{

  const data = await productService.getProductsDetail(req);

  return res.status(200).json({
    success: true,
    message: "Product detail fetch successfully",
    data
  })
}

module.exports = {
  getProducts,
  getProductSearch,
  createProduct,
  getProductsDetail
};
