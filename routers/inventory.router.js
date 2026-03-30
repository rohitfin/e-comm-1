const express = require("express");
const router = express.Router();
const {
  getInventoryByProduct,
  updateInventory,
  getLowStock
} = require("../controllers/inventory.controller");
const validateId = require("../middlewares/validateId.middleware");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const {
  createInventorySchema,
  updateInventorySchema,
} = require("../validators/inventory.validator");
const asyncHandler = require("../middlewares/asyncHandler");

router.post(
  "/report/low-stock/:number",
  asyncHandler(authProtect),
  authorize("admin", "seller"),
  asyncHandler(getLowStock),
);

router.get(
  "/:id",
  validateId,
  asyncHandler(authProtect),
  authorize("admin", "seller"),
  getInventoryByProduct,
);

router.post(
  "/:id",
  validateId,
  asyncHandler(authProtect),
  authorize("admin", "seller"),
  validateMiddleware(updateInventorySchema),
  updateInventory,
);


module.exports = router;
