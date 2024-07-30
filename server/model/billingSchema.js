const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
   
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  // Other fields as needed
});

module.exports = mongoose.model('Billing', billingSchema);
