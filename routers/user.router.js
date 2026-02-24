const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  createUserFn,
  updatePassword,
  getUserDetail,
  deleteUser
} = require("../controllers/user.controllers");
const validateMiddleware = require("../middlewares/validate.middleware");
const { createUserSchema } = require("../validators/user.validator");
// const userController = require("../controllers/user.controllers");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/create", createUser);
router.post(
  "/",
  validateMiddleware(createUserSchema),
  createUserFn,
);
router.put("/update-password/:id", updatePassword);
router.post("/user-detail", getUserDetail);
router.delete("/:id", deleteUser);

module.exports = router;
