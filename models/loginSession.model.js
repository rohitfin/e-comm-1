const mongoose = require("mongoose");

const loginSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_users",
    required: true
  },
  ipAddress: String,
  userAgent: String,
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("tbl_login_sessions", loginSessionSchema);