const mongoose = require('mongoose');
const crypto = require('crypto')
const uuid = require('uuid').v4;
const Salt = uuid();

const UserSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    maxlength: 50,
  },
  email: {
    required: true,
    type: String,
    maxlength: 50,
  },
  hashed_password: {
    required: true,
    type: String,
    minlength: 5
  },
  salt: {
    type: String
  },
  history: {
    type: String,
    details: Array,
    default: ''
  },
  favorite: {
    type: Array,
    default: []
  },
  frequentlyView: {
    type: Array,
    default: []
  },
  recentView: {
    type: Array,
    default: []
  },
  cart: {
    type: Array,
    default: []
  },
  ordered: {
    type: Array,
    status: ''
  },
}, {timestamps: true})

UserSchema.virtual('password')
.set(function(password){
  this._password = password;
  this.salt = Salt;
  this.hashed_password = this.createHashedPassword(password);
})
.get(function() {
  return this._password
})

UserSchema.methods = {
  createHashedPassword: function(plainText) {
    if (!plainText) {
      return ''
    }
    try {
      return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex')
    } catch(err) {
      console.log('hashing error line:70')
      return ''
    }
  },
  authentication: function(plainText) {
    console.log(this.hashed_password == this.createHashedPassword(plainText))
    return this.hashed_password == this.createHashedPassword(plainText);
  }
}

module.exports = mongoose.model('User', UserSchema)