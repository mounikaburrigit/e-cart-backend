const Product = require('../models/Product')

const getProducts = async (
  req,
  res
) => {
  try {
    const {category} = req.query

    let products

    if (category) {
      products = await Product.find({
        category: {
          $regex: new RegExp(
            category,
            'i'
          ),
        },
      })
    } else {
      products = await Product.find()
    }

    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

const getSingleProduct = async (
  req,
  res
) => {
  const product = await Product.findById(
    req.params.id
  )

  if (!product) {
    return res.status(404).json({
      message: 'Product Not Found',
    })
  }

  res.json(product)
}

const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      image,
      category,
      brand,
      stock,
    } = req.body

    const productExists =
      await Product.findOne({
        title,
      })

    if (productExists) {
      return res.status(400).json({
        message:
          'Product Already Exists',
      })
    }

    const product =
      await Product.create({
        title,
        description,
        price,
        image,
        category,
        brand,
        stock,
      })

    res.status(201).json(product)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getProducts,
  getSingleProduct,
  addProduct,
}