const express = require('express')
const {
    requireAuth,
    requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getOrders, addOrder, updateOrder, deleteReview, getOrderById } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireuth)

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.put("/:id", updateOrder)
router.post('/', addOrder)
// router.delete('/:id',  requireAuth, deleteReview)

module.exports = router
