// Contains routes for cook and customer details
const express = require('express');
const _ = require('lodash');
const { Menu } = require('./../models/menu');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');

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

module.exports = router;


