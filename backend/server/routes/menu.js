// Contains routes for cook and customer details
const express = require('express');
const _ = require('lodash');
const { Menu } = require('./../models/menu');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');
const {ObjectID} = require('mongodb');
const {Cook} = require('./../models/cook');

const router = express.Router();

router.post('/add', authenticateCook, (req,res) => {
  const cook = req.user;
  const items = _.pick(req.body, ['menuItems']);
  if (items.menuItems.length === 0) {
    return res.status(400).send({
      error: 'No menu item passed'
    });
  }
  Menu.insertMany(items.menuItems).then((docs) => {
    console.log(docs);
    res.status(200).send({
      status: 'OK'
    });
  }).catch((error) => {
    res.status(400).send({
      error
    });
  }); 
});

router.get('/all/me', authenticateCook, (req,res) => {
  const cook = req.cook;
  Menu.find({
    cookId: cook._id
  }).then((items) => {
    return res.status(200).send({
      status: 'OK',
      menuItems: items,
      error: "null"
    });
    }).catch((error) => {
      return res.status(400).send({
        status: 'error',
        menuItems: null,
        error
      });;
  });
});

router.get('/all/activated', (req,res) => {
  Menu.find({
    isActive: true
  }).then((items) => {
    res.status(200).send({
      status: 'OK',
      menuItems: items,
      error: "null"
    });
  }).catch((error) => {
    res.status(400).send({
      status: '400',
      menuItems: null,
      error
    });
  });
});

router.post('/activate/:menuId', authenticateCook, (req,res) => {
  const menuId = req.params.menuId;
  if (_.isNull(menuId) || _.isEmpty(menuId) || !(ObjectID.isValid(menuId))) {
    return res.status(400).send({
      status: "error",
      error: "Invalid Menu ID"
    });
  }

  Menu.findOneAndUpdate({
    _id: ObjectID(menuId)
  },
  {
    $set: {
      isActive: true
    }
  }
).then((item) => {
  item.isActive = true;
  res.status(200).send({
    status: 'OK',
    menuItem: item,
    error: "null"
  });
}).catch((error) => {
  error.status = "error";
  error.menuItem = "null";
  res.status(400).send(error);
});
});

router.get('/activated', (req,res) => {
  const token = req.header('x-auth');
  Cook.findByToken(token).then((cook) => {
    if (!cook) {
      return res.status(404).send({
        status: '404',
        error: 'Cook not found',
        items: "null"
      });
    }
    return Menu.find({
      cookId: cook._id,
      isActive: true
    });
  }).then((items) =>{
    if (_.isEmpty(items)) {
      return res.status(404).send({
        error: "No activated items found",
        status: "error",
        items: "null"
      });
    }
    res.status(200).send({
      error: "null",
      status: "OK",
      items
    });
  }).catch((error) => {
    error.status = "error";
    error.items = "null";
    res.status(400).send(error);
  });
});

module.exports = router;


