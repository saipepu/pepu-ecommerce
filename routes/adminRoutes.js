const express = require('express');
const { signup, signin, isRequiredSignIn, isAuth, isTeamLeader, adminById, signout } = require('../controllers/adminController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Basic Admin Routes')
})

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/isRequiredSignIn/:adminById', isRequiredSignIn, isAuth, isTeamLeader, (req, res) => {
  res.send('You have been authenticated. Thank you for Signing In')
})
router.get('/signout', signout);

router.param('adminById', adminById)

module.exports = router;