const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SignupDb = require("../model/signUpSchema");

// exports.authHandler = async (req, res) => {
//   const { action } = req.params;

//   if (action === "signup") {
//     return await signup(req, res);
//   } else if (action === "login") {
//     return await login(req, res);
//   } else {
//     return res
//       .status(400)
//       .json({ message: "Invalid action. Use 'signup' or 'login'." });
//   }
// };

//  Signup
exports.signup = async (req, res) => {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    role: req.body.role,
  };

  let email = data.email;

  const existingUser = await SignupDb.findOne({ email: email });
  if (existingUser) {
    res.status(400).json("User Already Exists");
  } else {
    // Hasing the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = new SignupDb({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
    });
    user
      .save(user)
      .then((data) => {
        res.send(data);
        console.log(" User Added Successfully!");
      })
      .catch((err) => {
        res.status(500).send({ message: err.message || "Some Error Occurred" });
      });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    const user = await SignupDb.findOne({ email });

    // Handle Case If user Is Not Found

    if (!user) {
      return res.status(404).send("No User Found");
    }

    //  Password Match

    let passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }
    // Gentrate JWT Token

    let token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: 86400,
      }
    );
    console.log();
    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
