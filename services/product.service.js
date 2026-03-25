const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const Category = require("../models/category.model");

exports.getProduct = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true";
  }

  if (query.category) {
    const category = await Category.findOne({ name: { $regex: query.category, $option: "i" } });

    if (category) {
      filter.category = category._id;
    } else {
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPage: 0,
        },
      };
    }
  }

  if (query.search) {
    filter.$or = [{ name: { $regex: query.search, $option: "i" } }];
  }

  const products = await Product.find(filter).skip(skip).limit(limit).lean();

  if (!products) {
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPage: 0,
      },
    };
  }

  const total = await Product.countDocuments(filter);

  return {
    data: products,
    pagination: {
      total: total,
      page,
      limit,
      totalPage: Match.ceil(total / limit),
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
