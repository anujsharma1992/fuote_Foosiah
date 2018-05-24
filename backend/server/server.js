const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const { authenticateCook, authenticateCustomer } = require('./middleware/authenticate');
const { Cook } = require('./models/cook');
const { Customer } = require('./models/customer');
const { mongoose } = require('./db/mongoose');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const detailRoutes = require('./routes/details');
const menuRoutes = require('./routes/menu');

const SERVER_PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
// root path
app.get('/', (req,res) => {
  res.send("Welcome to foosiah");
});

// routes to register cook or customer
app.use('/register', registerRoutes);

// routes to login cook or customer
app.use('/login', loginRoutes);

// routes to logout cook or customer
app.use('/logout', logoutRoutes);

// routes to get details of cook or customer
app.use('/details', detailRoutes);

// routes related to menu items
app.use('/menu', menuRoutes);

app.listen(SERVER_PORT , () => {
  console.log(`Server started at port ${SERVER_PORT}`)
});