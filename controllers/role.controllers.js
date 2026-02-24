const asyncHandler = require("../middlewares/asyncHandler");
const roleService = require("../services/role.service");
const mongoose = require("mongoose");

const getRoles = asyncHandler(async (req, res) => {
  const roles = await roleService.getRoles();

  return res.status(200).json({
    success: true,
    message: "Roles fetch successfully",
    data: roles,
  });
});

const addRole = asyncHandler(async (req, res) => {
  let role = await roleService.addRole(req.body);

  res.status(201).json({
    success: true,
    message: "Role created successfully",
    data: role,
  });
});

const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  let role = await roleService.updateRole(id, name);

  res.status(200).json({
    success: true,
    message: "Name updated successfully",
    data: role,
  });
});

const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid role ID");
  }

  await roleService.deleteRole(id);

  res.status(200).json({
    success: true,
    message: "Role deleted successfully",
  });
});


module.exports = { getRoles, addRole, updateRole, deleteRole };
