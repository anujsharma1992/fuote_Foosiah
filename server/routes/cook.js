const express = require('express');
const { Cook } = require('./../models/cook');
const _ = require('lodash');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');
const {ObjectID} = require('mongodb');

const router = express.Router();

// route to update the fcmToken of a cook
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

// activate a cook
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

 // deactivate a cook
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

 // get all cooks
 router.get('/all', (req,res) => {
   const page = req.query.page;

   if (page < 1) {
    return res.status(400).send({
      status: '400',
      menuItems: null,
      error: "Page Number has to be atleast 1"
    });
  }

  Cook.paginate({}, {
    page,
    limit: 10
  }).then((cooks) => {
    res.status(200).send({
      status: 'OK',
      cooks: cooks.docs,
      error: null,
      totalPages : cooks.pages
    });
  }).catch((error) => {
    error.status = '400';
    error.cooks = null;
    error.totalPages = null;
    res.status(400).send(error);
  });

 });

 // deactivate a cook
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

// get all activated cooks
router.get('/all/activated', (req,res) => {
  const page = req.query.page;
  
  if (page < 1) {
    return res.status(400).send({
      status: '400',
      menuItems: null,
      error: "Page Number has to be atleast 1"
    });
  }
  
  Cook.paginate({
    isActive: true
  }, {
    page,
    limit: 10
  }).then((items) => {
    res.status(200).send({
      status: 'OK',
      cooks: items.docs,
      error: null,
      totalPages : items.pages
    });
  }).catch((error) => {
    error.status = '400';
    error.cooks = null;
    error.totalPages = null;
    res.status(400).send(error);
  });
});

module.exports = router;