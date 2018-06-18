const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

const CuisineSchema = mongoose.Schema({
  type: String
});

CuisineSchema.plugin(mongoosePaginate);
const Cuisine = mongoose.model('Cuisine', CuisineSchema);

module.exports = { Cuisine };