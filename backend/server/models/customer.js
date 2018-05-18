const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./../utils/utils.js');
const bcrypt = require('bcryptjs');

const CustomerSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'User Email Required'],
    minLength: 3,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE is not a valid email}`
    }
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minLength: 6
  },
  tokens : [{
    access : {
      type: String,
      required: true
    },
    token : {
      type: String,
      required: true
    }
  }],
  phoneNumber: {
    type: Number,
    required: [true, 'User phone number required'],
    minLength: 10
  },
  firstName: {
    type: String,
    required: [true, 'User first name required'],
    minLength: 3
  },
  lastName: {
    type: String,
    required: [true, 'User last name required'],
    minLength: 1
  },
  addresses: [{
    address: {
      type: String,
      required: [true, 'Address required']
    },
    lat: {
      type: String,
      required: [true]
    },
    lon: {
      type: String,
      required: [true]
    }
  }],
  dob: String,
  profilePhoto : String,
  fcmToken: String
  // TODO Payment Info
});

CustomerSchema.methods.toJSON = function() {
  let customer = this;
  let customerObject = customer.toObject();
  // do not get tokens and password in JSON
  return _.pick(customerObject, ['_id','email','phoneNumber','firstName','lastName','addresses','dob','profilePhoto','fcmToken']);
}

CustomerSchema.methods.generateAuthToken = function() {
  let customer = this;
  let access = 'auth';
  let token = jwt.sign({
    _id : customer._id.toHexString(),
    access
  }, SECRET_KEY).toString();
  customer.tokens = customer.tokens.concat([{ access, token }]);
  return customer.save().then((doc) => {
    return token;
  });
};

CustomerSchema.statics.findByCredentials = function(email,password) {
  let Customer = this;
  return Customer.findOne({
    email
  }).then((customer) => {
    if (!customer) {
      return Promise.reject({
        e: 'Customer not found for the given email'
      });
    }

    return new Promise((res,rej) => {
      bcrypt.compare(password, customer.password).then((isValid) => {
        if (isValid) res(customer);
        else rej({ error: 'Password is not valid' });
      }).catch(e => rej(e));
    });

  });
};

CustomerSchema.statics.findByToken = function(token) {
  let customer = this;
  let decoded;

  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return Promise.reject();
  }

  return customer.findOne({
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access': 'auth'
  });

}

CustomerSchema.pre('save', function(next) {
  let customer = this;
  if (customer.isModified('password')) {
    bcrypt.genSalt(10).then((salt) => {
      let password = customer.password;
      return bcrypt.hash(password, salt);
    }).then((hash) => {
      customer.password = hash;
      next();
    }).catch((e) => {
      return console.log(e);
    });
  } else {
    next();
  }

});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = { Customer };