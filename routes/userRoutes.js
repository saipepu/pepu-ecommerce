const express = require('express');
const { signup, signin, signout, userById, isRequiredSignIn, isAuth } = require('../controllers/userController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Basic User Routes')
})
router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', signout)
router.get('/isRequiredSignIn/:userById', isRequiredSignIn, isAuth, (req, res) => {
  res.send('You are now Authenticated. Thank you so much for Signing In')
})

router.param('userById', userById)

module.exports = router;