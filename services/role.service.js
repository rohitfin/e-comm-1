const RoleModel = require("../models/role.model");
const ApiError = require("../utils/ApiError");

exports.getRoles = async () => {
  return await RoleModel.select("-__v").lean();
};

exports.addRole = async (payload) => {
  const { name } = payload;

  if (!name) {
    throw new ApiError(400, "Role name is required");
  }

  const existingRole = await RoleModel.findOne({
    name: name.trim().toLowerCase(),
  });

  if (existingRole) {
    throw new ApiError(409, "Role already exists");
  }

  const role = await RoleModel.create({
    name: name.trim().toLowerCase(),
  });

  return role;
};

exports.updateRole = async (id, name) => {
  const role = await RoleModel.findById(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  role.name = name;

  await role.save();

  return role;
  
};

exports.deleteRole = async(id)=>{
  const role = await RoleModel.findByIdAndDelete(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  return role;
};