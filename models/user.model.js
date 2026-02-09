const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    roleId: { type: String, require: true },
    password: { type: String, require: true },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    createdIP: { type: String, default: null },
    // modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true },
);

const user = mongoose.model("tbl_users", userSchema);
module.exports = user;


