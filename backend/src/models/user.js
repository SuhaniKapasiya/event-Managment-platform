const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },

    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be strong (min 8 chars, 1 letter, 1 number, 1 special character)"
          );
        }
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
    },

    role: { type: String, enum: ["user", "admin"], default: "user" },

   
  },
  { timestamps: true }
);

// Generate JWT Token
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

// Compare Password
userSchema.methods.comparepassword = async function (InputPassword) {
  const user = this;
  const Passwordhashe = user.password;

  const isValidPassword = await bcrypt.compare(InputPassword, Passwordhashe);

  return isValidPassword;
};;

module.exports = mongoose.model("User", userSchema);
