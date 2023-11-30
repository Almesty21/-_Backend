const User = require("../Model/userModel");
const express = require("express");
const router = express.Router();

const test = (req, res) => {
  res.status(200).json({ message: "User Route working fine" });
};

const findUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById({ _id: id }).populate("order");
    if (user) {
      res.status(200).json({ message: "User Found", user });
    } else {
      res.status(404).json({ message: "User Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in finding user", error });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({ name, email, password });

  try {
    newUser.save();
    res.send("User Registered successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.find({ email, password });

    if (user.length > 0) {
      const currentUser = {
        name: user[0].name,
        email: user[0].email,
        isAdmin: user[0].isAdmin,
        _id: user[0]._id,
      };
      res.send(currentUser);
    } else {
      return res.status(400).json({ message: "User Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Something went wrong' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  const userid = req.body.userid;

  try {
    await User.findOneAndDelete({ _id: userid });
    res.send('User Deleted Successfully');
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports = {
  router,
  test,
  findUser,
  registerUser,
  loginUser,
  getAllUsers,
  deleteUser,
};
