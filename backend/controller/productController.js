const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 6
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getProductById = asyncHandler(async (req, res) => {
    const prod = await Product.findById(req.params.id)
    if (prod) {
        res.json(prod)
    } else {
        res.status(404)
        throw new Error('Product Not Found')
    }

})

const deleteProduct = asyncHandler(async (req, res) => {
    const prod = await Product.findById(req.params.id)
    if (prod) {
        await prod.remove()
        res.json({ message: 'Product Deleted' })
    } else {
        res.status(404)
        throw new Error('Product Not Found')
    }

})

const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        numReviews: 0,
        price: 0,
        countInStock: 0,
        name: "Sample name",
        image: "/images/sampleImg.jpg",
        description: "Sample Desc",
        brand: "sample brand",
        category: "Sample Category",
        user: req.user._id,
    })
    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})

const updateProduct = asyncHandler(async (req, res) => {
    const { price, countInStock, name, image, description, brand, category } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        product.price = price
        product.countInStock = countInStock
        product.name = name
        product.image = image
        product.description = description,
            product.brand = brand,
            product.category = category

        const updatedProduct = await product.save()
        res.status(201).json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }
        product.reviews.push(review)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, r) => r.rating + acc, 0) / product.reviews.length
        await product.save()
        res.status(201).json({ message: 'Review added' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)
    res.json(products)
})

module.exports = { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }