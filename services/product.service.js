const Product = require("../models/product.model");
const ApiError = require("../utils/apiError");
const Category = require("../models/category.model");
const Inventory = require("../models/inventory.model");
const mongoose = require("mongoose");

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

exports.getProductSearch = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const matchStage = {
    // isDeleted: false
  };

  // isActive filter
  if (query.isActive !== undefined) {
    matchStage.isActive = query.isActive === "true";
  }

  // search (text or regex)
  if (query.search) {
    matchStage.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
    ];
  }

  // price filter
  if (query.minPrice || query.maxPrice) {
    matchStage.price = {};
    if (query.minPrice) matchStage.price.$gte = Number(query.minPrice);
    if (query.maxPrice) matchStage.price.$lte = Number(query.maxPrice);
  }

  // sorting
  let sortStage = { createdAt: -1 }; // default
  if (query.sort) {
    const [field, order] = query.sort.split("_");
    sortStage = { [field]: order === "asc" ? 1 : -1 };
  }

  const result = await Product.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "tbl_categories",
        localField: "categoryId", // in TBL_PRODUCT
        foreignField: "_id", // TBL_CATEGORIES
        as: "category", // name defining
      },
    },
    {
      $unwind: {
        // $unwind → Convert Array → Object
        path: "$category",
        preserveNullAndEmptyArrays: true, // keeps product even if no category
      },
    },
    // Add categoryName without removing product fields
    {
      $addFields: {
        categoryName: "$category.name",
      },
    },
    // remove full category object (clean response)
    {
      $project: {
        category: 0,
      },
    },
    /*
    // OR
    {
      $project: {
        id: 1,
        name: 1,
        price: 1,
        description: 1,
        sellerId: 1,
        stock: 1,
        categoryName: "$category.name",
      },
    },
    */

    // Pagination + Count
    {
      $facet: {
        products: [{ $skip: skip }, { $limit: limit }],
        pagination: [
          { $count: "totalCount" },
          {
            $addFields: {
              page: page,
              limit: limit,
              totalPages: {
                $ceil: { $divide: ["$totalCount", limit] },
              },
            },
          },
        ],
      },
    },

    // Convert pagination array → object
    {
      $project: {
        products: 1,
        pagination: { $arrayElemAt: ["$pagination", 0] },
      },
    },
  ]);

  return result[0];
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

exports.getProductsDetail = async (req) => {
  const productId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw ApiError("400", "Invalid product ID");
  }

  const matchStage = {
    _id: new mongoose.Types.ObjectId(productId),
  };

  const result = await Product.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "tbl_categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "tbl_users",
        let: { sellerId: "$sellerId" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$_id", "$$sellerId"] },
            },
          },
          {
            $project: {
              password: 0, // remove
              tokens: 0, // remove
              __v: 0,
            },
          },
        ],
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "tbl_inventory",
        let: { productId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: [{ $toObjectId: "$productId" }, "$$productId"] },
            },
          },
          {
            $project: {
              _id: 1,
              stock: 1,
              warehouse: 1,
            },
          },
        ],
        as: "inventory",
      },
    },
    
    {
      $addFields: {
        user: "$user.name", //You are replacing full user object with just user.name
        categoryName: "$category.name",
        totalStock: { $sum: "$inventory.stock" },
      },
    },

    {
      $project: {
        // user: 0, // it is all ready replaced  on 'addFields'
        category: 0,
      },
    },


  ]);

  if (!result.length) {
    throw ApiError("404", "Product not found");
  }

  return result[0];
};
