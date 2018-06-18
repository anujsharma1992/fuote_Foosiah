// Contains routes for cook and customer details
const express = require('express');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');
const { Menu } = require('./../models/menu');
const { Cook } = require('./../models/cook');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const router = express.Router();

// full details of the cook
router.get('/cook', async (req,res) => {

  const id = req.query.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      status: '400',
      cook: null,
      error: 'Invalid ID'
    });
  }
  let cook = await Cook.findById(id);
  if (cook == null) {
    return res.status(404).send({
      status: '404',
      cook: null,
      error: 'No cook found for the given ID'
    });
  }
  let menuItems = await Menu.find({
  cookId: cook._id
  });
  if (menuItems == null) {
    menuItems = [];
  }
  let cookObj = _.pick(cook, ['email','phoneNumber','firstName','lastName','addresses','dob','profilePhoto','kitchenName','isActive']);
  cookObj.items = menuItems;
  console.log(cookObj);
  res.status(200).send({
    status: 'OK',
    cookObj
  });
});

router.get('/customer', authenticateCustomer, (req,res) => {
  const customer = req.customer;
  res.status(200).send({
    status: 'OK',
    customer
  });
});

module.exports = router;