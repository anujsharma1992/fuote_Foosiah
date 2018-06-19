const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  // list of menu items
  menuItems: [{
    name: String,
    cost: Number,
    menuId : String,
    quantity: Number
  }],
  // ID of the customer 
  customerId: String,
  // ID of the cook
  cookId: String,
  customerFirstName: String,
  customerLastName: String,
  // Payment Type
  paymentType: {
    type: String,
    enum: ['COD', 'Online', 'Paytm'],
    required: [true]
  },
  paymentId: String,
  dateAndTime: {
    type: Date,
    required: Date.now
  },
  status: {
    type: String,
    enum: ['Requested','Confirmed','Cooked','Delivered','Cancelled-User','Cancelled-Cook']
  },
  estimatedTime : String,
  placedTime: Number,
  acceptedTime: Number,
  cookedTime: Number,
  deliveredTime: Number 
  // TODO Payment Related Items
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };