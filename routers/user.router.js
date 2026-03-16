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

router.get("/", authProtect, authorize("admin"), getUsers);
router.get("/:id", validateId, getUserById);
router.post(
  "/",
  authProtect,
  validateMiddleware(createUserSchema),
  createUser,
);
router.put("/update-password/:id", validateId, updatePassword);
router.get("/detail/:id", validateId, getUserDetail);
router.delete("/:id", authProtect, authorize("admin"), validateId, deleteUser);

module.exports = router;
