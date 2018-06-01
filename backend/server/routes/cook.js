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

 router.post('/activate', authenticateCook, (req,res) => {
   const cook = req.cook;
   if (cook.isActive) {
     return res.status(400).send({
       status: '400',
       error: 'Cook already active'
     });
   }
  Cook.updateOne({
    _id: cook._id
  },{
    $set: {
      isActive: true
    }
  }).then((cook) => {
    res.status(200).send({
      status: 'OK',
      error: null
    });
  }).catch((error) => {
    res.status(400).send({
      status: '400',
      error: 'Unable to activate cook. Check the token.'
    });
  });
 });

 router.post('/deactivate', authenticateCook, (req,res) => {
  const cook = req.cook;
  if (!cook.isActive) {
    return res.status(400).send({
      status: '400',
      error: 'Cook already deactivated'
    });
  }
 Cook.updateOne({
   _id: cook._id
 },{
   $set: {
     isActive: false
   }
 }).then((cook) => {
   res.status(200).send({
     status: 'OK',
     error: null
   });
 }).catch((error) => {
   res.status(400).send({
     status: '400',
     error: 'Unable to deactivate cook. Check the token.'
   });
 });
 });

module.exports = router;