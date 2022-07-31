const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getReviews, deleteOrder, addOrder, getGigById } = require('./review.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireuth)

router.get('/', getReviews)
router.get('/:id', getGigById)
// router.put('/:id', requireAuth, updateToy)
// router.post('/',  log, requireAuth, addReview)
// router.delete('/:id',  requireAuth, deleteReview)

module.exports = router
