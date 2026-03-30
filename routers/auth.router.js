const express = require("express");
const router = express.Router();
const { login, logout, refreshToken, logoutAll } = require("../controllers/auth.controllers");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const asyncHandler = require("../middlewares/asyncHandler");

router.post("/login", login);
router.post("/logout", authProtect, logout);
router.post("/refresh-token", asyncHandler(refreshToken));
router.post("/logout-all", authProtect, authorize("admin"), logoutAll);

module.exports = router;