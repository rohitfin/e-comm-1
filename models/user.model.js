const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // Use indexes for fields that are frequently searched or filtered.
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: { type: String, minlength: 6, select: false }, // hide password in response

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_roles",
      required: true,
    },

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

  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  this.password = await bcrypt.hash(this.password, rounds);
});

// Hash password on update
userSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (!update) return;

  const password = update.password || (update.$set && update.$set.password);

  if (!password) return;

  if (password.startsWith("$2b$")) return;

  const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
  const hashed = await bcrypt.hash(password, rounds);

  if (update.password) update.password = hashed;
  if (update.$set) update.$set.password = hashed;
});

// userSchema.pre("findOneAndUpdate", async function () {
//   const update = this.getUpdate();

//   if (!update || !update.password) return;

//   if (typeof update.password === 'string' && update.password.startsWith("$2b$")) return;

//   const rounds = parseInt(process.env.BCRYPT_ROUNDS, 10) || 10;
//   update.password = await bcrypt.hash(update.password, rounds);
// });

// compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive data from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const user = mongoose.model("tbl_users", userSchema);
module.exports = user;
