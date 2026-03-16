const User = require("../models/user.model");

class UserRepository {

  async findAll() {
    return User.find({}).lean();
  }

  async findById(id) {
    return User.findById(id).lean();
  }

  async findByEmail(email) {
    return User.findOne({ email });
  }

  async create(data) {
    return User.create(data);
  }

  async updatePassword(userId, password) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.password = password;
    await user.save();

    return user;
  }

  async softDelete(userId) {
    return User.findByIdAndUpdate(
      { _id: userId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

}

module.exports = new UserRepository();