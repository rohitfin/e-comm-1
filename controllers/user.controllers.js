const { default: mongoose } = require("mongoose");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const asyncHandler = require("../middlewares/asyncHandler");
const userService = require("../services/user.service");

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).lean();

    if (!users) {
      return res.status(400).json({
        code: 400,
        message: "No user is present!",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "User fetch successful",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Error getUser",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        code: 400,
        message: "User id is incorrect!",
      });
    }

    const result = await UserModel.findById(id).lean();

    if (!result) {
      return res.status(404).json({
        code: 404,
        message: "User not found!",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Error getUser",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, roleId, password } = req.body;

    // Basic Validation
    if (!name || !email || !roleId) {
      return res.status(400).json({
        code: 400,
        message: "Required fields missing",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({
        code: 400,
        message: "Invalid roleId",
      });
    }

    // Check duplicate email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        code: 409,
        message: "Email already exists",
      });
    }

    // Hash password (if provided)
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await UserModel.create({
      name,
      email,
      roleId,
      password: hashedPassword,
      createdIP: req.ip,
    });

    return res.status(201).json({
      code: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const createUserFn = asyncHandler(async (req, res) => {
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

  const user = await userService.updatePassword(id, password);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: user,
  });
});

const getUserDetail = asyncHandler(async (req, res) => {
  let { _id } = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await userService.getUserDetailById(_id);

  res.status(200).json({
    success: true,
    message: "User fetch successfully!",
    data: user,
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  createUserFn,
  updatePassword,
  getUserDetail,
};
