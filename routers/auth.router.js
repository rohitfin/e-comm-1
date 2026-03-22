const express = require("express");
const router = express.Router();
const { login, logout, refreshToken } = require("../controllers/auth.controllers");
const { authProtect } = require("../middlewares/auth.middleware");

router.post("/login", login);
router.get("/logout", authProtect, logout);
router.get("/refresh-token", refreshToken);

module.exports = router;