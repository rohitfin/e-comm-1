const express = require("express");
const router = express.Router();
const { getRoles, addRole, updateRole, deleteRole } = require("../controllers/role.controllers");
const validateMiddleware = require("../middlewares/validate.middleware");
const { createRoleSchema } = require("../validators/role.validator");

router.get("/", getRoles);
router.post("/", validateMiddleware(createRoleSchema), addRole);
router.put("/:id", updateRole);
router.delete('/:id', deleteRole);

module.exports = router;
