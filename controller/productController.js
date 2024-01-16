const Product = require("../model/product");

exports.add = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.file.path,
            category: req.body.category,
        });

        if (!product.name || !product.price || !product.description || !product.image || !product.category) {
            return res.status(400).send({
                message: "All fields are required",
            });
        }

        const savedProduct = await product.save();
        if (!savedProduct) {
            return res.send({
                status: "error",
                message: "Failed to save the product",
            });
        }

        res.json({
            message: "Product added successfully",
            data: savedProduct,
        });
    } catch (err) {
        res.send({
            status: "error",
            message: err.message,
        });
    }
};

exports.update = async (req, res) => {
    try {
        if (!req.body.name || !req.body.price || !req.body.description || !req.body.image || !req.body.category || !req.query._id) {
            return res.status(400).send({
                message: "All fields are required",
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.query._id, {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
        });

        if (!updatedProduct) {
            return res.send({
                status: "error",
                message: "Failed to update the product",
            });
        }

        res.json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (err) {
        res.send({
            status: "error",
            message: err.message,
        });
    }
};

exports.delete = async (req, res) => {
    try {
        if (!req.query._id) {
            return res.status(400).send({
                message: "Product id is required",
            });
        }

        const deletedProduct = await Product.findByIdAndUpdate(req.query._id, {
            deletedAt: new Date(),
        });

        if (!deletedProduct) {
            return res.send({
                status: "error",
                message: "Failed to delete the product",
            });
        }

        res.json({
            message: "Product deleted successfully",
        });
    } catch (err) {
        res.send({
            status: "error",
            message: err.message,
        });
    }
};

exports.get = async (req, res) => {
    try {
        const products = await Product.find({ deletedAt: null });

        if (!products || products.length === 0) {
            return res.send({
                status: "error",
                message: "No products found",
            });
        }

        res.json({
            message: "Products fetched successfully",
            data: products,
        });
    } catch (err) {
        res.send({
            status: "error",
            message: err.message,
        });
    }
};
