const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updatePassword,
  getUserDetail,
  deleteUser,
} = require("../controllers/user.controllers");
const validateId = require("../middlewares/validateId.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const { createUserSchema } = require("../validators/user.validator");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const asyncHandler = require("../middlewares/asyncHandler");

router.get("/", asyncHandler(authProtect), authorize("admin"), getUsers); // /users?role=admin,seller&isActive=true&search=rohit
router.get("/:id", validateId, getUserById);
router.post(
  "/",
  asyncHandler(authProtect),
  authorize("admin"),
  validateMiddleware(createUserSchema),
  createUser,
);
router.put("/update-password/:id", validateId, updatePassword);
router.get("/detail/:id", validateId, getUserDetail);
router.delete(
  "/:id",
  asyncHandler(authProtect),
  authorize("admin"),
  validateId,
  deleteUser,
);

module.exports = router;
