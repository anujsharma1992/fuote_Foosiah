// Contains routes for cook and customer login
const express = require('express');
const { Customer } = require('./../models/customer');
const { Cook } = require('./../models/cook');
const _ = require('lodash');

const router = express.Router();

router.post('/cook', (req,res) => {
  let body = _.pick(req.body, ['email','password']);
  Cook.findByCredentials(body.email,body.password).then((cook) => {
    return cook.generateAuthToken();
  }).then((token) => {
    res.status(200).send({
      status: "OK",
      token,
      error: null
    });
  }).catch((error) => {
    res.status(400).send({
      status: "400",
      token: "null",
      error
    });
  });
});

router.post('/customer', (req,res) => {
  let body = _.pick(req.body, ['email','password']);
  Customer.findByCredentials(body.email,body.password).then((customer) => {
    return customer.generateAuthToken();
  }).then((token) => {
    res.status(200).send({
      status: "OK",
      token,
      error: null
    });
  }).catch((error) => {
    res.status(400).send({
      status: "400",
      token: "null",
      error
    });
  });
});

module.exports = router;