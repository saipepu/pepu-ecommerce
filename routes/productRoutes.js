const express = require('express');
const { list, create, productById, update, photo, singleProduct, remove, serachList } = require('../controllers/productController');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Basic Product Routes')
})
router.get('/list', list)
router.post('/create', create)
router.put('/update/:productById', update);
router.get('/photo/:productById', photo);
router.get('/singleProduct/:productById', singleProduct)
router.delete('/delete/:productById', remove);
router.get('/searchList', serachList)

router.param('productById', productById)

module.exports = router;