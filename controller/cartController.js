const Cart = require("../model/cart");


exports.add = async (req, res) => {
	try {
	  const { id, name, price, image, category, quantity, userId,productId } = req.body;
  
	  const cart = new Cart({
		id,
		name,
		price,
		image,
		category,
		quantity,
		userId,
		productId
	  });
  
	  const requiredFields = ['name', 'price', 'quantity', 'category', 'userId','productId'];
	  const missingFields = requiredFields.filter(field => !cart[field]);
  
	  if (missingFields.length > 0) {
		return res.status(400).send({
		  message: "All fields are required",
		  missingFields,
		});
	  }
  
	  const existingItem = await Cart.findOne({id });
  
	  if (existingItem) {
		return res.status(400).send({
		  message: "Product already exists in cart",
		  data: existingItem,
		});
	  }
  
	  const savedCart = await cart.save();
  
	  res.status(200).send({
		message: "Product added to cart successfully",
		data: savedCart,
	  });
	} catch (error) {
	  res.status(400).send({
		status: "error",
		message: "An error occurred while adding product to cart",
		error: error.message,
	  });
	}
  };
  

exports.update = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).send({
        message: "Product id is required",
      });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { id: req.body.id },
      { $inc: { quantity: 1 } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(400).send({
        message: "Product not found",
      });
    }

    res.status(200).send({
      message: "Quantity increased successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "An error occurred while increasing quantity",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { id },
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(400).send({
        message: "Product not found",
      });
    }

    if (updatedCart.quantity === 0) {
      await Cart.findOneAndRemove({ id });
      return res.status(200).send({
        message: "Product removed from cart successfully",
        data: null,
      });
    }

    res.status(200).send({
      message: "Quantity decreased successfully",
      data: updatedCart,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "An error occurred while decreasing quantity",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const cart = await Cart.find({ userId });

    if (!cart || cart.length === 0) {
      return res.status(400).send({
        message: "Cart not found",
      });
    }

    res.send({
      message: "Cart retrieved successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).send({
      message: "An error occurred while getting cart",
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const cart = await Cart.find({});

    res.status(200).send({
      message: "All items fetched from cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      message: "An error occurred while getting all products",
    });
  }
};
