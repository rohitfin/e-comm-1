const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

exports.createUser = async (data, ip) => {
  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const user = await User.create({
    ...data,
    createdIP: ip,
  });

  return user;
};

exports.updatePassword = async (userId, newPassword) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.password = newPassword;

  await user.save(); // triggers pre("save") hook

  return user;
};
