const express = require("express");
const billingRoute = express.Router();
const billingController = require("../controller/billingController");
const { verifyToken } = require("../middleware/authMiddleware");

billingRoute.post("/get-billing-history",verifyToken, billingController.getBilling);

module.exports = billingRoute;
