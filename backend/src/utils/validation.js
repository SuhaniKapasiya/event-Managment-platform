const validator = require("validator");

const validateSignupData = (req) => {

const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "gender",
    "skills",
    "photoUrl",
    "age",
  ];

  // DO validation like  if photoURL correct or not  ,about ,skiil are minimum 10 age between 18-120 like this using validator

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validateSignupData, validateProfileEditData };
