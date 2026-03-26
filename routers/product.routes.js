const express = require("express");
const router = express.Router();
const { getProducts, getProductSearch, createProduct, getProductsDetail } = require("../controllers/product.controller");
const { createProductSchema } = require("../validators/product.validator");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");

router.get( //?search=lenovo&category=electronics&minPrice=500&maxPrice=50000&isActive=true&page=1&limit=10&sort=price_asc
  "/",
  authProtect,
  authorize("admin", "seller"),
  getProducts,
);

router.get( //?search=lenovo&category=electronics&minPrice=500&maxPrice=50000&isActive=true&page=1&limit=10&sort=price_asc
  "/search",
  authProtect,
  authorize("admin", "seller"),
  getProductSearch,
);

router.get(
  "/:id",
  authProtect,
  authorize("admin", "seller"),
  getProductsDetail,
);


router.post(
  "/",
  authProtect,
  authorize("admin", "seller"),
  validateMiddleware(createProductSchema),
  createProduct,
);



module.exports = router;