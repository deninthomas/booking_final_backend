const Booking = require('../model/bookingSchema');
const Product = require('../model/productModel');
const Billing = require('../model/billingSchema');
const jwt = require("jsonwebtoken");


exports.checkForTokenAndDecode = (req) => {
    let userId = null;
    const tokenWithBearer = req.headers["authorization"];
    const tokenParts = tokenWithBearer.split(" ");

    const decoded = jwt.verify(tokenParts?.[1], process.env.SECRET_KEY);
    if (!decoded) {
        return userId
    }
    else {
        userId = decoded.id
        return userId
    }
}
const { checkForTokenAndDecode } = require('./bookingController');

exports.createBooking = async (req, res) => {
    try {
        const { productId, startDate, endDate, numberOfPersons } = req.body;
        const userId = checkForTokenAndDecode(req);

        if (!userId) {
            return res.status(403).send({ error: true, message: "Invalid token" });
        }

        // Validate required fields
        if (!productId || !startDate || !endDate || !numberOfPersons) {
            return res.status(400).send({ message: 'Product ID, start date, end date, and number of persons are required' });
        }

        // Find the product to get the capacity and price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Find overlapping bookings for the product
        const existingBookings = await Booking.find({
            productId,
            $or: [
                { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
            ],
        });

        // Sum up the number of persons for existing bookings
        const totalPersonsBooked = existingBookings.reduce((sum, booking) => sum + booking.numberOfPersons, 0);

        // Check if the capacity is exceeded
        if (totalPersonsBooked + numberOfPersons > product.capacity) {
            return res.status(400).send({ message: 'Sold out for the selected dates' });
        }

        // Calculate total price for the booking
        const daysBooked = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
        const totalPrice = daysBooked * product.price * numberOfPersons;

        // Create the new booking
        const booking = new Booking({
            productId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            userId,
            numberOfPersons,
            totalPrice,
        });

        const bookingData = await booking.save();

        // Update or create billing record
        let billing = await Billing.findOne({ userId });
        if (!billing) {
            billing = new Billing({
                bookingId: bookingData._id,
                userId,
                totalAmount: 0,
            });
        }
        billing.totalAmount += totalPrice;
        await billing.save();

        res.status(201).send(booking);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getBookings = async (req, res) => {
    const userId = req.params.id;

    try {
        const token = checkForTokenAndDecode(req)
        if (!token) {
            return res.status(403).send({ error: true, message: "Invalid token" });
        }
        else {
            if (userId) {
                const bookings = await Booking.find();
                res.status(200).json(bookings);
            }
            else {
                const usersBookings = await Booking.findById({
                    userId: token
                });
                console.log('bookings', bookings)
                res.status(200).json(usersBookings);
            }
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};