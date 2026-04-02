const express = require("express");
const router = express.Router();
const {
  getCart,
  addCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");
const { authProtect } = require("../middlewares/auth.middleware");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(authProtect), asyncHandler(getCart));
router.post(
  "/",
  asyncHandler(authProtect),
  asyncHandler(addCart),
);
router.put(
  "/item/:itemId",
  asyncHandler(authProtect),
  asyncHandler(updateCartItem),
);
router.delete(
  "/item/:itemId",
  asyncHandler(authProtect),
  asyncHandler(removeCartItem),
);
router.delete("/", asyncHandler(authProtect), asyncHandler(clearCart));

module.exports = router;
