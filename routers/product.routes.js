const express = require("express");
const router = express.Router();
const { getProducts, createProduct } = require("../controllers/product.controller");
const { createProductSchema } = require("../validators/product.validator");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");

router.get(
  "/",
  authProtect,
  authorize("admin", "seller"),
  getProducts,
);

router.post( //?search=lenovo&category=electronics&minPrice=500&maxPrice=50000&isActive=true&page=1&limit=10&sort=price_asc
  "/",
  authProtect,
  authorize("admin", "seller"),
  validateMiddleware(createProductSchema),
  createProduct,
);



module.exports = router;