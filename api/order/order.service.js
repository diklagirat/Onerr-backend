const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query() {
    try {
        const collection = await dbService.getCollection('order')
        const orders = await collection.find({}).toArray()
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}
async function getById(orderId) {

    const collection = await dbService.getCollection('order')
    const order = collection.findOne({ _id: ObjectId(orderId) })
    return order
}

async function update(order) {
    try {
        order._id = ObjectId(order._id);
        const collection = await dbService.getCollection('order');
        await collection.updateOne({ _id: order._id }, { $set: { ...order } });
        return order;
    } catch (err) {
        logger.error(`cannot update order ${order._id}`, err);
        throw err;
    }
}

async function remove(orderId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('order')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(orderId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function add(order) {
    try {
        const collection = await dbService.getCollection('order')
        const addedOrder = await collection.insertOne(order)
        return addedOrder.ops[0]
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

module.exports = {
    query,
    remove,
    add,
    getById,
    update
}
