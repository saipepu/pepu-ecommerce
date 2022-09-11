const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  price: {
    type: Number,
    required: true,
    maxlength: 20
  },
  description: {
    type: String,
    required: true
  },
  specification: {
    type: String,
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  sold: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    default: 0,
  },
  photo: {
    data: Buffer,
    ContentType: String
  },
  promotion: {
    type: Number
  }
}, { timestamps: true })

module.exports = mongoose.model('Product', ProductSchema)