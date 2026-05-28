const express = require('express')

const router = express.Router()

const {
  getProducts,
  getSingleProduct,
  addProduct,
} = require('../controllers/productController')

router.get('/', getProducts)

router.get('/:id', getSingleProduct)

router.post('/', addProduct)

module.exports = router