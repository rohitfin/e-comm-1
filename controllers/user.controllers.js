const { default: mongoose } = require("mongoose");
const UserModel = require("../models/user.model");

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
    let { name, email, roleId, password, isActive, isDeleted } = req.body;

    if (!name) {
      return res.status(400).json({
        code: 400,
        message: "Name field is missing",
      });
    }
    if (!email) {
      return res.status(400).json({
        code: 400,
        message: "Email field is missing",
      });
    }
    if (!roleId) {
      return res.status(400).json({
        code: 400,
        message: "RoleId field is missing",
      });
    }
    if (isActive !== true && isActive !== false) {
      return res.status(400).json({
        code: 400,
        message: "isActive field is missing",
      });
    }
    if (isDeleted !== true && isDeleted !== false) {
      isDeleted = false;
    }

    let result = await UserModel.create(req.body);

    return res.status(200).json({
      code: 200,
      message: "User Created Successful",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Error",
      error: error.message,
    });
  }
};

module.exports = { getUsers, getUserById, createUser };
