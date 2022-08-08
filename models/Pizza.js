//dependencies
const { Schema, model } = require("mongoose");

//Schema data
//with MongoDB and Mongoose, no need to type the special data types
const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    //if no value was created, then set to current date, this way no need to create the timestamp elsewhere
    default: Date.now,
  },
  size: {
    type: String,
    default: "Large",
  },
  //[] states the empty array as a data type, but can also specify by saying types: Array instead.
  toppings: [],
});

const Pizza = model("Pizza", PizzaSchema);
//export the Pizza Model
module.exports = Pizza;
