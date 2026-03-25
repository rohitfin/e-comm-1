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

router.post(
  "/",
  authProtect,
  authorize("admin", "seller"),
  validateMiddleware(createProductSchema),
  createProduct,
);



module.exports = router;