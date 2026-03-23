const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const Role = require("../models/role.model");
const userRepository = require("../repositories/user.repository");

exports.getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.role) {
    const roles = query.role.split(",");

    const roleDocs = await Role.find({
      name: { $in: roles },
    });

    const roleIds = roleDocs.map((r) => r._id);

    if (roleIds.length > 0) {
      filter.roleId = { $in: roleIds };
    } else {
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("-password")
    .populate("roleId", "name")
    .lean();

  const total = await User.countDocuments(filter);

  const formattedUsers = users.map((user) => ({
    ...user,
    role: user.roleId?.name,
    roleId: user.roleId?._id,
  }));

  return {
    data: formattedUsers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.createUser = async (data, ip) => {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new ApiError(409, "Email already exists");
  }

  const role = await Role.findById({ _id: data.roleId });

  if (!role) {
    throw new Error("Invalid roleId: Role does not exist");
  }

  const user = await User.create({
    ...data,
    createdIP: ip,
  });

  // const userObj = user.toObject();
  // delete userObj.password;

  return user; // password auto-removed via toJSON
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
  const user = await userRepository
    .findById(userId)
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

exports.deleteUser = async (id) => {
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
};
