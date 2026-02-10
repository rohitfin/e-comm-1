const express = require("express");
const router = express.Router();
const { getUsers, getUserById, createUser } = require("../controllers/user.controllers");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/create-user", createUser);

module.exports = router;
