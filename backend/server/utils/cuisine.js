// utility to add all cuisines
const {Cuisine} = require('./../models/cuisine');

const listOfCuisines = [
  {type:"American"},
  {type:"British"},
  {type:"Caribbean"},
  {type:"Chinese"},
  {type:"French"},
  {type:"Greek"},
  {type:"Indian"},
  {type:"Italian"},
  {type:"Japanese"},
  {type:"Mediterranean"},
  {type:"Mexican"},
  {type:"Moroccan"},
  {type:"Spanish"},
  {type:"Thai"},
  {type:"Turkish"},
  {type:"Vietnamese"},
  {type:"Punjabi"},
  {type:"Gujarati"},
  {type:"Rajasthani"},
  {type:"North Indian"},
  {type:"South Indian"},
  {type:"Andhra"},
  {type:"Kerala"},
  {type:"Chettinad"},
  {type:"Bengali"},
  {type:"North Eastern"},
  {type:"Kashmiri"}
];

Cuisine.insertMany(listOfCuisines).then((value) => {
  console.log(value);
  if (value != null) {
    console.log("Success");
  } else {
    console.log("Failure");
  }
}).catch((e) => {
  console.log(`Failure ${e}`);
});