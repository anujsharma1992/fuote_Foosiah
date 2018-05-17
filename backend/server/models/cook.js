const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('./../utils/utils.js');
const bcrypt = require('bcryptjs');

const CookSchema = mongoose.Schema({
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
    access : String,
    token : String
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
  kitchenName: {
    type: String,
    required: [true]
  },
  isActive: {
    type: Boolean,
    default: false 
  },
  // fcm token from firebase for push notifications
  fcmToken: String
  // to add payment details
});

CookSchema.methods.toJSON = function() {
  let cook = this;
  let cookObject = cook.toObject();
  // do not get tokens and password in JSON
  return _.pick(cookObject, ['_id','email','phoneNumber','firstName','lastName','addresses','dob','profilePhoto','kitchenName','isActive','fcmToken']);
}

CookSchema.methods.generateAuthToken = function() {
  let cook = this;
  let access = 'auth';
  let token = jwt.sign({
    _id : cook._id.toHexString(),
    access
  }, SECRET_KEY).toString();
  cook.tokens = cook.tokens.concat([{ access, token }]);
  return cook.save().then((doc) => {
    return token;
  });
};

CookSchema.statics.findByToken = function(token) {
  let Cook = this;
  let decoded;

  try {
    decoded = jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return Promise.reject();
  }

  return Cook.findOne({
    '_id': decoded._id,
    'tokens.token' : token,
    'tokens.access': 'auth'
  });

}

CookSchema.pre('save', function(next) {
  let cook = this;
  if (cook.isModified('password')) {
    bcrypt.genSalt(10).then((salt) => {
      let password = cook.password;
      return bcrypt.hash(password, salt);
    }).then((hash) => {
      cook.password = hash;
      next();
    }).catch((e) => {
      return console.log(e);
    });
  } else {
    next();
  }

});

const Cook = mongoose.model('Cook', CookSchema);

module.exports = { Cook };