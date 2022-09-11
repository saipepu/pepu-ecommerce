const mongoose = require('mongoose');
const { ObjectId } = mongoose;

const categorySchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    maxlength: 50
  },
  parentId: {
    type: String
  }
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)