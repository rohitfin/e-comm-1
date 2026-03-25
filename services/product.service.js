const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const Category = require("../models/category.model");

exports.getProduct = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    // isDeleted: false,
  };

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.category) {
    const category = await Category.findOne({
      name: { $regex: query.category, $options: "i" },
    }).lean();

    if (!category) {
      return {
        data: [],
        pagination: { total: 0, page, limit, totalPage: 0 },
      };
    }

    filter.categoryId = category._id;
  }

  let sort = { createdAt: -1 }; //Latest first

  if (query.search) {
    filter.$text = { $search: query.search };

    if (query.sort === "price_asc") {
      sort = { price: 1 };
    } else if (query.sort === "price_desc") {
      sort = { price: -1 };
    } else {
      sort = { score: { $meta: "textScore" } }; // Best match first - MongoDB gives each result a score
    }
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  const products = await Product.find(filter)
    .select(query.search ? { score: { $meta: "textScore" } } : {}) // Score available - Mongo needs score in projection to sort properly -> $text → generates score .select() → exposes that score
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("categoryId", "name")
    .populate("sellerId", "name email")
    .lean();

  const total = await Product.countDocuments(filter);

  const formattedProducts = products.map((p) => ({
    ...p,
    category: p.categoryId?.name || null,
  }));

  return {
    products: formattedProducts,
    pagination: {
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

exports.createProduct = async (req) => {
  const { name, price, categoryId, description } = req.body;

  const category = await Category.findOne({
    _id: categoryId,
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (price <= 0) {
    throw new ApiError(400, "Price must be greater than 0");
  }

  const payload = {
    name,
    price,
    description,
    categoryId,
    sellerId: req.user._id, // req.user.role === "admin" ? sellerId :
    createdBy: req.user._id,
    createdIP: req.ip,
  };

  const product = await Product.create(payload);

  if (!product) {
    throw new ApiError(500, "Product creation failed");
  }

  return product;
};
