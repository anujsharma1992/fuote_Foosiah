const mongoose = require('mongoose');
const validator = require('validator');

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
  profilePhoto : String
  // TODO Payment Info
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = { Customer };