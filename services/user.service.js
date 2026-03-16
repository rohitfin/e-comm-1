const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const Role = require("../models/role.model");
const userRepository = require("../repositories/user.repository");

exports.createUser = async (data, ip) => {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create({
    ...data,
    createdIP: ip,
  })

  // const userObj = user.toObject();
  // delete userObj.password;

  return user;  // password auto-removed via toJSON
};

exports.updatePassword = async (userId, newPassword) => {
  // const user = await userRepository.findById(userId);
  const user = await userRepository.updatePassword(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // user.password = newPassword;

  // await user.save(); // triggers pre("save") hook

  return user;
};

exports.getUserDetailById = async (userId) => {
  const user = await userRepository.findById(userId)
    .populate("roleId", "name")
    .select("-email -__v") // not comes on response
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    ...user,
    roleId: user.roleId?._id,
    roleName: user.roleId?.name,
  };
};

exports.deleteUser = async(id)=>{
  // const user = await User.findByIdAndUpdate(
  //   { _id: id, isDeleted: false }, // Prevent Double Delete
  //   { isDeleted: true }, // setting
  //   { new: true } //Return updated document
  // );

  const user = await userRepository.softDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found or already deleted");
  }

  return user;

}