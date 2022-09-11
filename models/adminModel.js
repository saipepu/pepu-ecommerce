const mongoose = require('mongoose');
const uuid = require('uuid').v4;
const Salt = uuid();
const crypto = require('crypto')

const AdminSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    maxlength: 50,
  },
  email: {
    required: true,
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  hashed_password: {
    required: true,
    type: String,
    minlength: 5
  },
  salt: {
    type: String,
  },
  history: {
    type: String,
    details: Array,
    default: ''
  }
}, {timestamps: true})

AdminSchema.virtual('password')
.set(function(password) {
  this._password = password;
  this.salt = Salt;
  this.hashed_password = this.createHashedPassword(password)
})
.get(function() {
  return this._password
})

AdminSchema.methods = {
  createHashedPassword: function(plainText) {
    if(!plainText) return ''
    
    try {
      return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex')
    } catch(err) {
      console.log('hashing error line:50')
      return ''
    }
  },
  authentication: function(plainText) {
    // return this.hashed_password == createHashedPassword(plainText);
    return this.hashed_password == this.createHashedPassword(plainText);
  }
}

module.exports = mongoose.model('Admin', AdminSchema);