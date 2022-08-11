const { Pizza } = require("../models");

//this is the same as the app.get/app.post/app.delete/app.update the CRUD method
const pizzaController = {
  //get all pizzas
  //same as sequelize .findAll() but using Mongoose instead
  getAllPizza(req, res) {
    Pizza.find({})
      //populate a field, passing in an object with the key path
      .populate({
        path: "comments",
        //using the select option, this tells mongoose that we don't care about the __v field on comments either. the minus sign in front of the field indiecates that we dont want it to be returned.
        //__v is the document number, how many time it has been updated, it will increase
        select: "-__v",
      })
      .select("-__v")
      //-1 set up the query so that the newset pizza returns first.  Sorts in DESC order by the _id value this gets the newset pizza because a timestamp value is hiden somewhere inside the mongoDB objectID
      .sort({ _id: -1 })
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //get one pizza by id
  //same as sequelize .findOne() but using Mongoose instead
  getPizzaById({ params }, res) {
    Pizza.findOne({ _id: params.id })
      .populate({
        path: "comments",
        select: "-__v",
      })
      .select("-__v")
      .then((dbPizzaData) => {
        //If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //createPizza
  //same as sequelize .create() but using Mongoose instead
  createPizza({ body }, res) {
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },

  //update pizza by id
  //same as sequelize Update() but using Mongoose instead
  updatePizza({ params, body }, res) {
    //set the parameter to true to return new version of document,  or else it will return original document
    //runValidators are the validators in the models/pizza.js, this is so it can validate any new information, ex. the specific size of pizza, if name was entered
    Pizza.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //delete pizza
  //same as sequelize .deleteOne() or .deleteMany(), but mongoos, findOneAndDelete, it includes more data if client wants
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

//after these are created, then need to make the routes
module.exports = pizzaController;
