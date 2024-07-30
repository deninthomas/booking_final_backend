const express = require("express");
const billingRoute = express.Router();
const bookingsController = require("../controller/bookingController");
const { verifyToken } = require("../middleware/authMiddleware");

billingRoute.post("/book-entity",verifyToken, bookingsController.createBooking);
billingRoute.post("/get-bookings/:id",verifyToken, bookingsController.getBookings);

module.exports = billingRoute;
