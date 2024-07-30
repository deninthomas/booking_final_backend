const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['deluxe', 'single', 'dormitory'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  images: [{
    type: String,
  }],
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
