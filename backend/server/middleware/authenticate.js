const {Cook} = require('./../models/cook');
const {Customer} = require('./../models/customer');

let authenticateCook = (req,res,next) => {
  let token = req.header('x-auth');
  Cook.findByToken(token).then((cook) => {
    if(!cook) {
      return Promise.reject();
    }
    req.cook = cook;
    req.token = token;
    next();
  }).catch((e) => {
    // handle error
    res.send(401).send(e);
  });
};

let authenticateCustomer = (req,res,next) => {
  let token = req.header('x-auth');
  Customer.findByToken(token).then((customer) => {
    if (!customer) {
      return Promise.reject();
    }
    req.customer = customer;
    res.token = token;
  }).catch((e) => {
    // handle error later
    res.send(401).send(e);
  });
};

module.exports = { authenticateCook, authenticateCustomer }; 