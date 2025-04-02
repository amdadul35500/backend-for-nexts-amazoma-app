import express from "express";
import bcrypt from "bcrypt";
import User from "../models/userModal.js";
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAuth } from "../utilis.js";

const userRouter = express.Router();

// GET ALL USERS
userRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
    }
  })
);

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ phone: req.body.phone });
    console.log(req.body);
    if (user.isAdmin === true) {
      res.send(user);
    } else {
      res.status(404).send("you are not admin!");
    }
  })
);

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ phone: req.body.number });
    if (user.phone) {
      res.send({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    }
    res.status(500).send({ message: "Phone is not found!" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      phone: req.body.number,
    });
    console.log(req.body);
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name;
      user.phone = req.body.phone;

      const updateUser = await user.save();
      res.send({
        _id: updateUser._id,
        name: updateUser.name,
        phone: updateUser.phone,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

export default userRouter;
