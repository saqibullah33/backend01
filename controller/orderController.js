const Orders = require("../model/orders");

exports.create = async (req, res) => {
	console.log(req.body.user)
  try {
	console.log(req.body.address)
    const order = new Orders({
      productId: req.body.productId,
      name: req.body.name,
      amount: req.body.amount,
      image: req.body.image,
      category: req.body.category,
      quantity: req.body.quantity,
      user: req.body.user,
      status: req.body.status,
	  address:req.body.address
    });

    const existingOrder = await Orders.findOne({ _id: req.body.orderId });

    if (existingOrder) {
      return res.status(200).json({
        message: "Order already exists",
      });
    }

    const savedOrder = await order.save();
    res.send({
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).send({
      message: "Some error occurred while creating the Order.",
	  error:error.message
    });
  }
};

exports.cancel = async (req, res) => {
  try {
    const updatedOrder = await Orders.findByIdAndUpdate(
      req.body.orderId,
      {
        status: "cancelled",
      },
      { new: true }
    );

    res.send({
      message: "Order cancelled successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).send({
      message: "Some error occurred while cancelling the Order.",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const { email } = req.body;
    const orders = await Orders.find({ user: { email: email } });
    
    res.json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      message: "Some error occurred while fetching the Orders.",
    });
  }
};
