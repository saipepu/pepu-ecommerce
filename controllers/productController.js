const Product = require('../models/productModel')
const _ = require('lodash')
const formidable = require('formidable')
const fs = require('fs')

exports.list = (req, res ) => {
  Product.find()
  .select('-photo')
  .exec((err, products) => {
    if (err || !products) return res.status(400).json({ getProductListSuccess: false, error: err})

    res.status(200).json({ getProductListSuccess: true, message: products})
  })
}
exports.singleProduct = (req, res) => {
  if(req.productById) return res.status(200).json({ getSingleProductSuccess: true, message: req.productById})
}
exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if(err || !product) return res.status(400).json({ success: false, error: 'no product with current id'})

    req.productById = product;
    next();
  })
}

exports.create = (req, res) => {
  console.log('creating')
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({ createProductSuccess: false, error: err })

    const product = new Product(fields);

    if(files){
      product.photo.data = fs.readFileSync(files.photo.filepath)
      product.photo.ContentType = files.photo.mimetype;
    }

    product.save((err, product) => {
      if (err) return res.status(400).json({ createProductSuccess: false, error: err})

      res.status(200).json({ createProductSuccess: true, message: product})
    })
  })
}

exports.update = (req , res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  
  form.parse(req, (err, fields, files) => {
    if(err) return res.status(400).json({ updateProductSuccess: false, error: err})

    console.log(req.productById.name)
    let product = _.extend(req.productById, fields)
    console.log(product.name);

    if(files) {
      console.log(files.photo);
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.ContentType = files.photo.mimetype
    }
    product.save((err, product) => {
      if (err) return res.status(400).json({ updateProductSuccess: false, error: err})

      res.status(200).json({ updateProductSuccess: true, message: product})
    })
  })
}

exports.photo = (req, res) => {
  console.log(req.productById.name)
  if(req.productById.photo.data) {
    res.set('Content-Type', req.productById.photo.ContentType)

    res.send(req.productById.photo.data);
  }
}

exports.remove = (req, res) => {
  Product.findOneAndDelete({ _id : req.productById._id}).exec((err, product) => {
    if(err) return res.status(400).json({ deleteProductSuccess: false, error: err})

    res.status(200).json({ deleteProductSuccess: true})
  })
}

exports.serachList = (req, res) => {
  console.log(req.query.name);
  let searchString = req.query.name
  let regex = /searchString/gi
  Product.find({ name: req.query.name }).select('-photo').exec((err, products) => {
    if(err) return res.status(400).json({ searchList: false, error: err})

    let lists = products.filter((item, index) => item.name.match(new RegExp(searchString, 'gi')))
    console.log(lists)
    let lists2 = products.filter((item, index) => item.name.split('').includes())
    res.status(200).json({ searchList: true, message: products})
  })
}