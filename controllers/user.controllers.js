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
  } catch {
    return res.status(500).json({
      code: 500,
      message: "Error getUser",
    });
  }
  return res.send("User page");
  // return res.send({code: 200, message: "Success!"})
};

module.exports = { getUsers };
