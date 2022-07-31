const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
  console.log('gig service')
  try {
    const collection = await dbService.getCollection('gig')
    const gigs = await collection.find({}).toArray()
    return gigs
  } catch (err) {
    logger.error('cannot find reviews', err)
    throw err
  }
}

async function getById(gigId) {

  const collection = await dbService.getCollection('gig')
  const gig = collection.findOne({ _id: ObjectId(gigId) })
  return gig
}

async function remove(reviewId) {
  try {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    const collection = await dbService.getCollection('review')
    // remove only if user is owner/admin
    const criteria = { _id: ObjectId(reviewId) }
    if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
    const { deletedCount } = await collection.deleteOne(criteria)
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove review ${reviewId}`, err)
    throw err
  }
}

async function add(review) {
  try {
    const reviewToAdd = {
      byUserId: ObjectId(review.byUserId),
      aboutUserId: ObjectId(review.aboutUserId),
      txt: review.txt,
    }
    const collection = await dbService.getCollection('review')
    await collection.insertOne(reviewToAdd)
    return reviewToAdd
  } catch (err) {
    logger.error('cannot insert review', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  const criteria = {}
  if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
  return criteria
}

module.exports = {
  query,
  remove,
  add,
  getById
}
