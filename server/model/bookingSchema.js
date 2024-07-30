const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  numberOfPersons: {
    type: Number,
    required: true,
  },
  // Other fields as needed
});

module.exports = mongoose.model('Booking', bookingSchema);
