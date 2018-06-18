const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
var mongoosePaginate = require('mongoose-paginate');

// schema for each menu item
const MenuSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true],
    minLength: 3
  },
  photo: {
    type: String,
    required: [true],
    minLength: 5
  },
  cost: {
    type: Number,
    required: [true],
    minLength: 2
  },
  description: {
    type: String,
    required: [true],
    minLength: 10
  },
  // estimated time of preparation
  time: {
    type: Number,
    required: [true]
  },
  // should be the ObjectID of the cook
  cookId: {
    type: String,
    validate: {
      validator: function(id) {
        return ObjectID.isValid(id);
      },
      message : `{VALUE} is not a valid Mongo DB ID`
    }
  },
  cuisines: [
    {
      id: {
        type: String,
        validate: {
          validator: function(id) {
            return ObjectID.isValid(id);
          },
        message : `{VALUE} is not a valid Mongo DB ID`
        }   
      },
      name: String
    }
  ],
  isActive: {
    type: Boolean,
    default: false
  },
  // average rating
  rating: {
    type: Number,
    default: 0
  } 
});

MenuSchema.plugin(mongoosePaginate);
const Menu = mongoose.model('Menu', MenuSchema);

module.exports = { Menu };