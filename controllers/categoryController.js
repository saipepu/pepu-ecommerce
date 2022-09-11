const Category = require('../models/categoryModel')
const _ = require('lodash')

const sortCategoryList = (categoriesList, parentId = null) => {

  const list = []
  let category
  if(parentId == null) {
    category = categoriesList.filter(item => item.parentId == undefined)
  } else {
    category = categoriesList.filter(item => item.parentId == parentId)
  }
  for(let item of category ) {
    list.push({
      _id: item._id,
      name: item.name,
      parentId: item?.parentId,
      children: sortCategoryList(categoriesList, item._id)
    })
  }
  return list;
}
exports.categoryById = (req, res, next , id)=> {
  console.log(id);
  Category.findById(id).exec((err, category) => {
    if (err || !category) return res.status(400).json({ success: false, error: 'no category with current id'})

    req.categoryById = category;
    next();
  })
}

exports.sortlist = (req, res) => {
  Category.find().exec((err, categoriesList) => {
    if (err || !categoriesList) return res.status(400).json({ getCategoryListSuccess: false, error: 'No Category List'})

    const list = sortCategoryList(categoriesList)
    res.status(200).json({ getCategoryListSuccess: true, message: list})
  })
}
exports.list = (req, res) => {
  Category.find().exec((err, categoriesList) => {
    if (err || !categoriesList) return res.status(400).json({ getCategoryListSuccess: false, error: 'No Categroy List'})

    res.status(200).json({ getCategoryListSuccess: true, message: categoriesList})
  })
}
exports.getSingle = (req, res) => {
  if(req.categoryById) return res.status(200).json({ getSingleCategory: true, message: req.categoryById})
}

exports.create = (req, res) => {
  let inComingData = {}
  if (req.body.parentId === "") {
    inComingData = {
      name: req.body.name
    }
  } else {
    inComingData = req.body
  }
  const category = new Category(inComingData);
  category.save((err, category) => {
    if (err) return res.status(400).json({ createCategorySuccess: false, error: err})

    res.status(200).json({ createCategorySuccess: true, message: category})
  })
}

exports.update = (req, res) => {

  Category.findById(req.categoryById._id).exec((err, category) => {
    if (err || !category) return res.status(400).json({ updateCategorySuccess: false, error: 'no category with current id'})

    let inComingData = {}
    if (req.body.parentId === "") {
      inComingData = {
        name: req.body.name
      }
    } else {
      inComingData = req.body
    }
    category = _.extend(category, inComingData);
    category.save((err, category) => {
      if (err) return res.status(400).json({ updateCategorySuccess: false, error: err })

      res.status(200).json({ updateCategorySuccess: true, message: category})
    })
  })
}

exports.remove = (req, res) => {
  Category.findOneAndDelete({ _id: req.categoryById}).exec((err, category) => {
    if (err) return res.status(400).json({ deleteCategorySuccess: false, error: err})

    res.status(200).json({ deleteCategorySuccess: true, message: 'Category Deleted'})
  })
}