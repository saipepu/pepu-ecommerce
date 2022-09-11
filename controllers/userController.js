const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')

exports.signup = (req, res) => {
  console.log(req.body);
  const user = new User(req.body)
  user.save((err, user) => {
    if (err) return res.status(400).json({ signUpSuccess: false, error: err })

    res.status(200).json({ signUpSuccess: true, message: user})
  })
}

exports.signin = (req, res) => {
  console.log(req.body);
  const {email, password} = req.body;
  User.findOne({ email: email}).exec((err, user) => {
    if (err || !user) return res.status(400).json({ signInSuccess: false, error: 'No user with this Email' })

    if (!user.authentication(password)) return res.status(400).json({ signInSuccess: false, error: "Email and Password don't match" })

    const token = jwt.sign({ _id: user._id}, 'userSecret')
    res.cookie('usertoken', token, {expire: new Date() + 9999 })
    res.status(200).json({ signInSuccess: true, message: { user, token }})
  })
}

exports.signout = (req, res) => {
  res.clearCookie('usertoken')
  res.status(200).json({ signOutSuccess: true, message: 'SignOut Completed'})
}

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) return res.status(400).json({ success: false, error: 'No user with current Id'})

    req.profile = user;
    next();
  })
}

exports.isRequiredSignIn = expressjwt({
  secret: 'userSecret',
  userProperty: 'auth',
  algorithms: ['HS256']
})

exports.isAuth = (req, res, next) => {
  if (req.profile && req.auth && req.profile._id.toString() != req.auth._id) return res.status(400).json({ error: 'Authentication Failed, Try Login Again'})

  next();
}