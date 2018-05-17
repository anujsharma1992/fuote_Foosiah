const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const { authenticateCook, authenticateCustomer } = require('./middleware/authenticate');
const { Cook } = require('./models/cook');
const { Customer } = require('./models/customer');
const { mongoose } = require('./db/mongoose');

const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
// root path
app.get('/', (req,res) => {
  res.send("Welcome to foosiah");
});

// path to register a new cook
app.post('/cook/register', (req,res) => {
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

// path to register a new customer
app.post('/customer/register', (req,res) => {
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

app.listen(SERVER_PORT , () => {
  console.log(`Server started at port ${SERVER_PORT}`)
});