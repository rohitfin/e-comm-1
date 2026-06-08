const orderService = require("../services/order.service");

const getOrder = async (req, res) => {
  const userId = req.user?._id;

  const data = await orderService.getOrder(userId);

  return res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data,
  });
};

const createOrder = async (req, res) => {

  const data = await orderService.createOrder(req);

  return res.status(200).json({
    success: true,
    message: "Order Created successfully",
    data,
  });
};

const getOrderDetail = async (req, res)=>{
  const data = await orderService.getOrderDetail(req);

  return res.status(200).json({
    success: true,
    message: "Order Detail fetch successfully",
    data
  })
}

module.exports = { createOrder, getOrder, getOrderDetail };
