const express = require('express');
const _ = require('lodash');

const SERVER_PORT = 3000;

const app = express();

// root path
app.get('/', (req,res) => {
  res.send("Welcome to foosiah");
});

app.listen(SERVER_PORT , () => {
  console.log(`Server started at port ${SERVER_PORT}`)
});