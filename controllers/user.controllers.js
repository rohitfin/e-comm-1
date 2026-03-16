// const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");
const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");
const ApiError = require("../utils/apiError");

const getUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({}).lean();

  if (!users || users.length === 0) {
    throw new ApiError(404, "No users found");
  }

  res.status(200).json({
    success: true,
    message: "User fetch successful",
    data: users,
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "User id is incorrect");
  }

  const result = await UserModel.findById(id).lean();

  if (!result) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "Success",
    data: result,
  });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body, req.ip);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user,
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await userService.updatePassword(id, password);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: user,
  });
});

const getUserDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await userService.getUserDetailById(id);

  res.status(200).json({
    success: true,
    message: "User fetch successfully!",
    data: user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  await userService.deleteUser(id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });

});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updatePassword,
  getUserDetail,
  deleteUser,
};
