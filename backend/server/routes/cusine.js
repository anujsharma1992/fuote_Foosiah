const { Cuisine } = require('./../models/cuisine');
const { Menu } = require('./../models/menu');
const _ = require('lodash');
const express = require('express');
const { authenticateCook } = require('./../middleware/authenticate');
const {ObjectID} = require('mongodb');

const router = express.Router();

router.get('/all', async (req,res) => {
  const cuisineId = req.query.id;
  const pageNo = parseInt(req.query.page);
  console.log(pageNo);
  if (cuisineId == null || _.isEmpty(cuisineId)) {
    return res.status(400).send({
      status: '400',
      error: 'No or invalid cuisine ID',
      menuItems: null
    });
  }
  if(pageNo <= 0) {
    return res.status(400).send({
      status: '400',
      error: 'pageNo should be greater than 0',
      menuItems: null
    });
  }
  // if (pageNo == null || _.isEmpty(pageNo)) {
  //   return res.status(400).send({
  //     status: '400',
  //     error: 'No or invalid page',
  //     menuItems: null
  //   });
  // }
  if (!ObjectID.isValid(cuisineId)) {
    return res.status(400).send({
      status: '400',
      error: 'Invalid cuisine ID',
      menuItems: null
    });
  }
  let items = await Menu.paginate({
    'cuisines': {
      $elemMatch: {
        id: cuisineId
      }
    }
  }, {
    page: pageNo,
    limit: 10
  });
  res.status(200).send({
    status: 'OK',
    menuItems: items.docs,
    error: null,
    totalPages: items.pages
  });
  
});


module.exports = router;