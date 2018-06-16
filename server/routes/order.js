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
    ordersFromDb = orders;
  }
  res.status(200).send({
    status: 'OK',
    error: null,
    orders: ordersFromDb
  });

});


module.exports = router;