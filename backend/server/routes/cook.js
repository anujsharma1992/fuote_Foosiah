const express = require('express');
const { Cook } = require('./../models/cook');
const _ = require('lodash');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');
const {ObjectID} = require('mongodb');

const router = express.Router();

router.post('/fcmToken/:token', authenticateCook, (req,res) => {
  const cook = req.cook;
  const token = req.params.token;
  Cook.updateOne({
    _id: cook._id
  },{
    $set: {
      fcmToken: token
    }
  }).then((cook) => {
    cook.token = token;
    res.status(200).send({
      status: 'OK',
      error: null
    });
  }).catch((error) => {
    res.status(400).send({
      status: '400',
      error
    });
  });
});

module.exports = router;