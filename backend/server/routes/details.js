// Contains routes for cook and customer details
const express = require('express');
const { authenticateCook, authenticateCustomer } = require('./../middleware/authenticate');

const router = express.Router();

// full details of the cook
router.get('/cook/me', authenticateCook, (req,res) => {
    const cook = req.cook;
    res.status(200).send({
      status: 'OK',
      cook
    });
});

router.get('/customer/me', authenticateCustomer, (req,res) => {
  const customer = req.customer;
  res.status(200).send({
    status: 'OK',
    customer
  });
});

module.exports = router;