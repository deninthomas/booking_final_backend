const Booking = require('../model/bookingSchema');
const Billing = require('../model/billingSchema');
const Product = require('../model/productModel');
const { checkForTokenAndDecode } = require('./bookingController');

exports.getBilling = async (req, res) => {
    try {
        const userId = checkForTokenAndDecode(req);

        if (!userId) {
            return res.status(403).send({ error: true, message: "Invalid token" });
        }
        // Find billing records by userId
        const billingRecords = await Billing.find({ userId });

        if (!billingRecords.length) {
            return res.status(404).send({ message: "No billing records found for this user" });
        }

        // Map over billing records to enrich with booking and product data
        const enrichedBillingRecords = await Promise.all(billingRecords.map(async (billing) => {
            const booking = await Booking.findById(billing.bookingId);
            const product = await Product.findById(booking.productId);
            console.log('bookings ', booking, product)
            return {
                ...billing._doc,
                booking: booking ? booking._doc : {},
                product: product ? product._doc : {},
            };
        }));

        res.status(200).send(enrichedBillingRecords);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

