const express = require("express");
const router = express.Router();
const { login, logout, refreshToken, logoutAll } = require("../controllers/auth.controllers");
const { authProtect } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

router.post("/login", login);
router.post("/logout", authProtect, logout);
router.post("/refresh-token", refreshToken);
router.post("/logout-all", authProtect, authorize("admin"), logoutAll);

module.exports = router;