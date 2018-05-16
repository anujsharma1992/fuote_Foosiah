const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  // list of menu items
  menuItems: [{
    name: String,
    cost: Number,
    id : {
      type: String,
      validate: {
        validator: function(id) {
          return ObjectID.isValid(id);
        },
        message : `{VALUE} is not a valid Mongo DB ID`
      }
    }
  }],
  // total cost
  totalCost: {
    type: Number,
    required: [true]
  },
  // ID of the customer 
  customerId: {
    type: String,
    validate: {
      validator: function(id) {
        return ObjectID.isValid(id);
      },
      message : `{VALUE} is not a valid Mongo DB ID`
    }
  },
  // ID of the cook
  cookId: {
    type: String,
    validate: {
      validator: function(id) {
        return ObjectID.isValid(id);
      },
      message : `{VALUE} is not a valid Mongo DB ID`
    }
  },
  // Payment Type
  paymentType: {
    type: String,
    enum: ['COD', 'Online', 'Paytm'],
    required: [true]
  },
  dateAndTime: {
    type: Date,
    required: Date.now
  }
  // TODO Payment Related Items
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };