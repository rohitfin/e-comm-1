const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
    password: { type: String, select: false }, // hide password in response
    
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_roles", required: true },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    createdIP: { type: String, default: null },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true },
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Update hook
userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (!update.password) return;

  if (update.password.startsWith("$2b$")) return;

  update.password = await bcrypt.hash(update.password, process.env.bcryptRound);
});

// Remove sensitive data from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const user = mongoose.model("tbl_users", userSchema);
module.exports = user;


