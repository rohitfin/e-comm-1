const cartService = require("../services/cart.service");

const getCart = async (req, res) => {
  const userId = req.user?._id;
  const data = await cartService.getCart(userId);

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data,
  });
};

const addCart = async (req, res) => {
  const userId = req.user?._id;
  const { productId, quantity } = req.body;

  const data = await cartService.addCart(userId, productId, quantity);

  return res.status(201).json({
    success: true,
    message: "Item added to cart",
    data,
  });
};

const updateCartItem = async (req, res) => {
  const userId = req.user?._id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const data = await cartService.updateCartItem(userId, itemId, quantity);

  return res.status(200).json({
    success: true,
    message: "Cart item updated",
    data,
  });
};

const removeCartItem = async (req, res) => {
  const userId = req.user?._id;
  const { itemId } = req.params;

  const data = await cartService.removeCartItem(userId, itemId);

  return res.status(200).json({
    success: true,
    message: "Cart item removed",
    data,
  });
};

const clearCart = async (req, res) => {
  const userId = req.user?._id;
  const data = await cartService.clearCart(userId);

  return res.status(200).json({
    success: true,
    message: "Cart cleared",
    data,
  });
};

const getCartTotal = async (req, res) => { 
  const user = req.user._id;

  const data = await cartService.getCartTotal(user);

  return res.status(200).json({
    success: true,
    message: "Cart Total",
    data,
  })

};

const getAdminCartTotal = async(req, res)=>{
  
  const data = await cartService.getAdminCartTotal();

  return res.status(200).json({
    success: true,
    message: "All Cart Total",
    data
  })

}

module.exports = {
  getCart,
  addCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartTotal,
  getAdminCartTotal
};
