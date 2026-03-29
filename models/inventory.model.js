const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    warehouse: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "tbl_products"
    },
    stock: { type: Number, default: 0, min: 0, required: true },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("tbl_inventory", inventorySchema);
module.exports = mongoose.model(
  "Inventory", // model name (code use)
  inventorySchema,
  "tbl_inventory" // force exact collection
);
