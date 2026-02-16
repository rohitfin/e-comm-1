const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  createUserFn,
  updatePassword,
  getUserDetail
} = require("../controllers/user.controllers");
const validateMiddleware = require("../middlewares/validate.middleware");
const { createUserSchema } = require("../validators/user.validator");
// const userController = require("../controllers/user.controllers");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/create-user", createUser);
router.post(
  "/create-new-user",
  validateMiddleware(createUserSchema),
  createUserFn,
);
router.put("/update-password/:id", updatePassword);
router.post("/user-detail", getUserDetail);

module.exports = router;
