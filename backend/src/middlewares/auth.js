const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {

    console.log("Middleware req");
    
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid");
    }

    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    console.log("user", user);
    

    if (!user) {
      throw Error("User not found");
    }
    req.user = user; // Assign user to request

    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  userAuth,
};
