const Category = require('../models/Category')

const getCategories = async (
  req,
  res
) => {
  const categories =
    await Category.find()

  res.json(categories)
}

const addCategory = async (
  req,
  res
) => {
  const {name, image} = req.body

  const category =
    await Category.create({
      name,
      image,
    })

  res.status(201).json(category)
}

module.exports = {
  getCategories,
  addCategory,
}