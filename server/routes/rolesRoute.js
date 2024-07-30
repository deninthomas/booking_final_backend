const express = require("express");
const jwt = require("jsonwebtoken");

const roleRoute = express.Router();

roleRoute.get("/appconfig", (req, res) => {
  const tokenWithBearer = req.headers["authorization"];

  if (!tokenWithBearer) {
    console.log("No token provided");
    return res.status(403).send({ error: true, message: "No token provided" });
  }

  const tokenParts = tokenWithBearer.split(" ");

  if (tokenParts.length !== 2) {
    console.log("Invalid token format");
    return res
      .status(403)
      .send({ error: true, message: "Invalid token format" });
  }

  const token = tokenParts[1];
  console.log("Extracted Token:", token); // Log the extracted token

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded Token:", decoded); // Log the decoded token

    if (!decoded) {
      console.log("Invalid token");
      return res.status(403).send({ error: true, message: "Invalid token" });
    }
    if (decoded) {
      return res.status(200).send(decoded);
    }
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).send({ error: true, message: "Token verification failed" });
  }
});

module.exports = roleRoute;
