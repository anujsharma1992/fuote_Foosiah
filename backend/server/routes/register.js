// Contains routes for cook and customer registration
const express = require('express');
const { Customer } = require('./../models/customer');
const { Cook } = require('./../models/cook');
const _ = require('lodash');

const router = express.Router();

router.post('/cook', (req,res) => {
  let body = _.pick(req.body, ['email','password','phoneNumber','firstName','lastName','addresses','dob','profilePhoto','kitchenName','isActive']);
  
  Cook.findOne({
    email: body.email
  }).then((cook) => {
    if (cook) {
      return res.status(400).send({
        status: "400",
        error: 'User with email already exists',
        token: "null"
      });
    }
    let cookToSave = new Cook(body);
    return cookToSave.save();
  }).then((cook) => {
    return cook.generateAuthToken();
  }).then((token) => {
    res.status(200).send({
      status: 'OK',
      token,
      error: null
    });
  }).catch((error) => {
    // handle error case
    res.status(400).send({
      status: "400",
      token: "null",
      error
    });
  });

});

router.post('/customer', (req,res) => {
  let body = _.pick(req.body, ['email','password','phoneNumber','firstName','lastName','addresses','dob','profilePhoto']);

  Customer.findOne({
    email: body.email
  }).then((customer) => {
    if (customer) {
      return res.status(400).send({
        status: "error",
        error: 'User with email already exists',
        token: "null"
      });
    }
    let customerToSave = Customer(body);
    return customerToSave.save();
  }).then((customer) => {
    return customer.generateAuthToken();
  }).then((token) => {
    res.status(200).send({
      status: 'OK',
      token,
      error: "null"
    });
  }).catch((error) => {
    res.status(400).send({
      status: "404",
      token: "null",
      error
    });
  });

});

module.exports = router;