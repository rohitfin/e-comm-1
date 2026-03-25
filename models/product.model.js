const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, default: "" },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_categories",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_users",
      required: true,
    },
    stock: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    createdIP: { type: String, default: null },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "tbl_users" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true },
);

// Indexes
productSchema.index({ sellerId: 1 });
productSchema.index({ categoryId: 1 });
productSchema.index({ isDeleted: 1, isActive: 1 });
productSchema.index({ name: 1, sellerId: 1 }, { unique: true });

const product = mongoose.model("tbl_products", productSchema);
module.exports = product;
