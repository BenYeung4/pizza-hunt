const { Pizza } = require("../models");

const pizzaController = {
  //get all pizzas
  //same as sequelize .findAll() but using Mongoose instead
  getAllPizza(req, res) {
    Pizza.find({})
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
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true })
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
