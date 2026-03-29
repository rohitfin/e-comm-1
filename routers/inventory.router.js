const express = require("express");
const router = express.Router();
const {
  getInventoryByProduct,
} = require("../controllers/inventory.controller");
const validateId = require("../middlewares/validateId.middleware");

router.get("/:id",
    getInventoryByProduct);

module.exports = router;
