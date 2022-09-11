const express = require('express');
const { create, list, sortlist, update, categoryById, remove, getSingle } = require('../controllers/categoryController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Basic Category Routes')
})
router.post('/create', create);
router.get('/sortlist', sortlist);
router.get('/list', list);
router.post('/update/:categoryById', update)
router.delete('/delete/:categoryById', remove)
router.get('/getSingle/:categoryById', getSingle)

router.param('categoryById', categoryById)

module.exports = router;