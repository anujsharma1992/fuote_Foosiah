const {Cook} = require('./../models/cook');
const {Customer} = require('./../models/customer');
const decode = require('jwt-decode');

let authenticateCook = (req,res,next) => {
  let token = req.header('x-auth');
  let decoded = decode(token);
  console.log(decoded);
  Cook.findByToken(token).then((cook) => {
    if(!cook) {
      return Promise.reject({
        e: 'Cook not found'
      });
    }
    req.cook = cook;
    req.token = token;
    next();
  }).catch((error) => {
    // handle error
    error.status = "error";
    res.status(401).send(error);
  });
};

let authenticateCustomer = (req,res,next) => {
  let token = req.header('x-auth');
  Customer.findByToken(token).then((customer) => {
    if (!customer) {
      return Promise.reject({
        e: 'Customer not found'
      });
    }
    req.customer = customer;
    req.token = token;
    next();
  }).catch((e) => {
    // handle error later
    res.status(401).send(e);
  });
};

module.exports = { authenticateCook, authenticateCustomer }; 