const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, default: "" },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stock: { type: Number, default: 0, min: 0 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdIP: { type: String, default: null },
    modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modifiedIP: { type: String, default: null },
  },
  { timestamps: true },
);

// Indexes
productSchema.index({ sellerId: 1 });
productSchema.index({ categoryId: 1 });
// productSchema.index({ isDeleted: 1, isActive: 1 });

// Optimized query index
productSchema.index({
  isDeleted: 1,
  isActive: 1,
  categoryId: 1,
});

// price filter
productSchema.index({ price: 1 });

// price + category
productSchema.index({ categoryId: 1, price: 1 });

// Search (weighted)
productSchema.index(
  { name: "text", description: "text" }, // "text" is a special keyword in MongoDB
  { weights: { name: 5, description: 1 } } // more important -> Product name match → more important, Description match → less important
);

// productSchema.index({ name: 1, sellerId: 1 }, { unique: true });

// Unique product per seller (case-insensitive + soft delete safe)
productSchema.index(
  { name: 1, sellerId: 1 }, // sellerId + name  => Unique combination
  {
    unique: true, //1 seller cannot create duplicate product names
    collation: { locale: "en", strength: 2 }, //Case insensitive
    partialFilterExpression: { isDeleted: false }, //Deleted products ignored
  },
);

const product = mongoose.model("Product", productSchema, "tbl_products");
module.exports = product;
