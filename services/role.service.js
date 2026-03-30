const Role = require("../models/role.model");
const ApiError = require("../utils/apiError");

exports.getRoles = async () => {
  return await Role.select("-__v").lean();
};

exports.addRole = async (payload) => {
  const { name } = payload;

  if (!name) {
    throw new ApiError(400, "Role name is required");
  }

  const existingRole = await Role.findOne({
    name: name.trim().toLowerCase(),
  });

  if (existingRole) {
    throw new ApiError(409, "Role already exists");
  }

  const role = await Role.create({
    name: name.trim().toLowerCase(),
  });

  return role;
};

exports.updateRole = async (id, name) => {
  const role = await Role.findById(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  role.name = name;

  await role.save();

  return role;
  
};

exports.deleteRole = async(id)=>{
  const role = await Role.findByIdAndDelete(id);

  if (!role) {
    throw new ApiError(404, "Role not found");
  }

  return role;
};