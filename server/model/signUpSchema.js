const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  phone: {
    type: Number,
    require: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); //  validation for a 10-digit phone number
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "is invalid"], // regex for email validation
  },
  password: {
    type: String,
    require: true,
  },
  role: { type: String, enum: ["admin", "user"], required: true },
});

const SignupDb = mongoose.model("User", signupSchema);

module.exports = SignupDb;
