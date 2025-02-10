const express = require("express");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    
  // console.log("req", req.body);

  try {
    // Validation
    validateSignupData(req);
    // creating new instance of user model

    const { firstName, lastName, email, password } = req.body;

    //Encrypted password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword ", hashedPassword);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.comparepassword(password);
    if (isValidPassword) {
      //Create token
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("User logged in successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logout Successfully");
});

module.exports = authRouter;
