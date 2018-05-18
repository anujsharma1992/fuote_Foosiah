// Contains routes for cook and customer registration
const express = require('express');
const { Customer } = require('./../models/customer');
const { Cook } = require('./../models/cook');
const _ = require('lodash');

const router = express.Router();

router.post('/cook', (req,res) => {
  let body = _.pick(req.body, ['email','password','phoneNumber','firstName','lastName','addresses','dob','profilePhoto','kitchenName','isActive']);
  let cook = new Cook(body);
  cook.save().then((cook) => {
    return cook.generateAuthToken();
  }).then((token) => {
    res.send({
      status: 'OK',
      token
    });
  }).catch((e) => {
    // handle error case
    res.status(400).send(e);
  });
});

router.post('/customer', (req,res) => {
  let body = _.pick(req.body, ['email','password','phoneNumber','firstName','lastName','addresses','dob','profilePhoto']);
  let customer = new Customer(body);
  customer.save().then((customer) => {
    return customer.generateAuthToken();
  }).then((token) => {
    res.send({
      status: 'OK',
      token
    });
  }).catch((e) => {
    // handle error cases
    res.status(400).send(e);
  });
});

module.exports = router;