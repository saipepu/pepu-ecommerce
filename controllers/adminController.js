const Admin = require('../models/adminModel')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')

// SIGN UP
exports.signup = (req, res) => {
  let adminList = process.env.adminList.split(',')
  if(adminList.includes(req.body.email)) {
    req.body.role = 1;
  }
  const admin = new Admin(req.body)
  admin.save((err, admin) => {
    if (err || !admin) return res.status(400).json({ signupSuccess: false, error: err})

    res.status(200).json({ signupSuccess: true, message: admin})
  })
}

// SIGN IN
exports.signin = (req, res) => {
  const { email, password } = req.body
  // find user by email
  Admin.findOne({ email: email}).exec((err, admin) => {
    if (err || !admin) return res.status(400).json({ signinSuccess: false, error: "No user with this Email"})

    if(!admin.authentication(password)) return res.status(400).json({ signinSuccess: false, error: "Email and Password don't match"})

    const token = jwt.sign({ _id: admin._id }, process.env.SECRET)
    res.cookie('token', token, {expire: new Date() + 9999 })
    res.status(200).json({ signinSuccess: true, message: {admin, token}});
  })
}

exports.adminById = (req, res, next, id) => {
  Admin.findById(id).exec((err, admin) => {
    if (err || !admin) return res.status(400).json({ isAuthSuccess: false, error: 'No user with this ID'})

    req.profile = admin;
    next();
  })
}

exports.isRequiredSignIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: 'auth',
  algorithms: ['HS256']
})

exports.isTeamLeader = (req, res, next) => {
  if(req.profile.role != 1) return res.status(400).json({ success: false, error: 'Login in as A Team Leader'})

  next();
}

exports.isAuth = (req, res, next) => {
  console.log(req.profile);
  console.log(req.auth);
  if(req.profile && req.auth && req.profile._id.toString() !== req.auth._id) return res.status(400).json({ isAuthSuccess: false, error: 'Authentication Failed'})

  next();
}

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ signOutSuccess: true, message: 'SignOut Completed'})
  console.log('signout')
}