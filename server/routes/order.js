const express = require('express');
const { Order } = require('./../models/order');
const _ = require('lodash');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');
const {ObjectID} = require('mongodb');

const router = express.Router();

router.post('/new', authenticateCustomer, async (req,res) => {
  const customer = req.customer;
  let order = _.pick(req.body, ['menuItems','cookId','paymentType','paymentId','estimatedTime','placedTime']);
  order.customerId = customer._id;
  order.customerFirstName = customer.firstName;
  order.customerLastName = customer.lastName;

  order.status = 'Requested';
  order.dateAndTime = Date.now();

  console.log(order);

  let orderToSave = Order(order);

  let savedOrder = await orderToSave.save();
  if (savedOrder == null) {
    return res.status(400).send({
      status: '400',
      error: 'Unable to place a new order.',
      order: null
    });
  }

  res.status(200).send({
    status: 'OK',
    error: null,
    order: savedOrder
  });

});

router.get('/activated/all', authenticateCook, async (req,res) => {
  const cook = req.cook;
  
  const orders = await Order.find({
    cookId: cook._id
  });
  let ordersFromDb = [];
  if (orders != null) {
    ordersFromDb = orders.filter((order) => {
      return order.status == 'Requested' && order.status != 'Confirmed'
    });
  }
  res.status(200).send({
    status: 'OK',
    error: null,
    orders: ordersFromDb
  })

});

// route for the cook to accept an order
router.post('/accept', authenticateCook, async (req,res) => {

  const orderId = req.query.orderId;
  
  if (_.isEmpty(orderId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid Order ID',
      order: null
    });
  }

  if (!ObjectID.isValid(orderId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid Order ID',
      order: null
    });
  }

  let order = await Order.findByIdAndUpdate(orderId, {
    $set: {
      status: 'Confirmed'
    }
  });

  if (order == null) {
    return res.status(400).send({
      status: '400',
      error: 'Unable to find an order with this ID',
      order: null
    });
  }

  order.status = 'Confirmed';

  res.status(200).send({
    status: 'OK',
    error: null,
    order
  });

  console.log("Order is accpeted "+ order);

});

// route for cook to reject the order
router.post('/reject', authenticateCook, async (req,res) => {

  const orderId = req.query.orderId;
  
  if (_.isEmpty(orderId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid Order ID',
      order: null
    });
  }

  if (!ObjectID.isValid(orderId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid Order ID',
      order: null
    });
  }

  let order = await Order.findByIdAndUpdate(orderId, {
    $set: {
      status: 'Cancelled-Cook'
    }
  });

  if (order == null) {
    return res.status(400).send({
      status: '400',
      error: 'Unable to find an order with this ID',
      order: null
    });
  }

  order.status = 'Cancelled-Cook';

  res.status(200).send({
    status: 'OK',
    error: null,
    order
  });

  console.log("Order is rejected "+ order);

});

// route for cook to dispatch the order
router.post('/done', authenticateCook, async (req,res) => {

  const orderId = req.query.orderId;
  
  if (_.isEmpty(orderId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid Order ID',
      order: null
    });
  }

  if (!ObjectID.isValid(orderId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid Order ID',
      order: null
    });
  }

  let order = await Order.findByIdAndUpdate(orderId, {
    $set: {
      status: 'Cooked'
    }
  });

  if (order == null) {
    return res.status(400).send({
      status: '400',
      error: 'Unable to find an order with this ID',
      order: null
    });
  }

  order.status = 'Cooked';

  res.status(200).send({
    status: 'OK',
    error: null,
    order
  });

  console.log("Order is cooked and dispatched "+ order);

});

module.exports = router;