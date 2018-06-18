const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const RatingSchema = mongoose.Schema({
  rating: {
    type: Number,
    required: [true]
  }, 
  review: {
    type: String,
    required: [true]
  },
  menuName: String,
  customerName: String,
  time: Number,
  cookId: {
    type: String,
    validate: {
      validator: function(id) {
        return ObjectID.isValid(id);
      },
      message : `{VALUE} is not a valid Mongo DB ID`
    }
  },
  menuId: {
    type: String,
    validate: {
      validator: function(id) {
        return ObjectID.isValid(id);
      },
      message : `{VALUE} is not a valid Mongo DB ID`
    }
  }
});

const Rating = mongoose.model('Rating', RatingSchema);

module.exports = { Rating };