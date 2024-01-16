const Admin = require("../model/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const { name, email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const newUser = new Admin({
      name,
      email,
      password,
    });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;

    const savedUser = await newUser.save();
    res.status(200).json({
      message: "Admin created successfully",
      data: savedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Admin creation failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: true,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 86400 },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Login successful",
          token: token,
          data: user,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Login failed",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.query._id) {
      return res.status(400).json({
        message: "Admin id is required",
      });
    }

    const user = await Admin.findByIdAndDelete(req.query._id);
    if (!user) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete admin",
    });
  }
};

exports.get = async (req, res) => {
  try {
    const users = await Admin.find();
    if (!users.length) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }

    res.status(200).json({
      message: "Admins fetched successfully",
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to fetch admins",
    });
  }
};
