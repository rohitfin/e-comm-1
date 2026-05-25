const express = require("express");
const router = express.Router();
const {
  getCart,
  addCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartTotal,
  getAdminCartTotal
} = require("../controllers/cart.controller");
const { authProtect } = require("../middlewares/auth.middleware");
const asyncHandler = require("../middlewares/asyncHandler");
const { authorize } = require("../middlewares/role.middleware");

router.get("/", asyncHandler(authProtect), asyncHandler(getCart));
router.post(
  "/",
  asyncHandler(authProtect),
  authorize("admin", "customer"),
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
router.get("/cart-total", asyncHandler(authProtect), asyncHandler(getCartTotal))
router.get("/cart-total-admin", asyncHandler(authProtect), asyncHandler(getAdminCartTotal))

module.exports = router;
