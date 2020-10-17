const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')

const { addOrderItems, getOrderById, updateOrderToPaid, getOrderList, getOrders, updateOrderToDelivered } = require('../controller/orderController')

router.route('/')
    .get(protect, admin, getOrders)
    .post(protect, addOrderItems)
router.route('/myorders').get(protect, getOrderList)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered)

module.exports = router;