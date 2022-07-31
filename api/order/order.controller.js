const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const orderService = require('./order.service')
const ObjectId = require("mongodb").ObjectId;


async function getOrders(req, res) {
    try {
        const orders = await orderService.query(req.query)
        // orders = orders.map((order) => {
        //     order.createdAt = ObjectId(order._id).getTimestamp();
        // return orders})
        res.send(orders)
    } catch (err) {
        logger.error('Cannot get orders', err)
        res.status(500).send({ err: 'Failed to get orders' })
    }
}

async function getOrderById(req, res) {
    try {
        const orderId = req.params.id
        const order = await orderService.getById(orderId)
        res.json(order)
    } catch (err) {
        res.status(404).send(err)
    }
}
async function updateOrder(req, res) {
    const updatedOrder = req.body;
    console.log(updatedOrder);
    try {
        const savedOrder = orderService.update(updatedOrder);
        res.send(savedOrder);
    } catch (err) {
        logger.error("Failed to update order", err);
        res.status(500).send({ err: "Failed to update order" });
    }
}

async function addOrder(req, res) {

    try {
        const order = req.body
        console.log('order----', order)
        const addedOrder = await orderService.add(order)
        console.log('addedOrder', addedOrder)
        res.send(addedOrder)
    } catch (err) {
        logger.error('Failed to add order', err)
        res.status(500).send({ err: 'Failed to add order' })
    }
}
async function deleteOrder(req, res) {
    try {
        const deletedCount = await orderService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove order' })
        }
    } catch (err) {
        logger.error('Failed to delete order', err)
        res.status(500).send({ err: 'Failed to delete order' })
    }
}

module.exports = {
    getOrders,
    deleteOrder,
    addOrder,
    getOrderById,
    updateOrder
}