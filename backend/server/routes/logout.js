// Contains routes for cook and customer login
const express = require('express');
const { Customer } = require('./../models/customer');
const { Cook } = require('./../models/cook');
const _ = require('lodash');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');

const router = express.Router();

router.delete('/customer', authenticateCustomer , (req,res) => {
  const token = req.token;
  const user = req.customer;
  user.removeToken(token).then(() =>{
    res.status(200).send({
      status: 'OK'
    });
  }).catch((error) => {
    res.status(404).send({
      error
    });
  });
});

router.delete('/cook', authenticateCook, (req,res) => {
  const token = req.token;
  const user = req.cook;
  user.removeToken(token).then(() =>{
    res.status(200).send({
      status: 'OK'
    });
  }).catch((error) => {
    res.status(404).send({
      error
    });
  });
});

module.exports = router;