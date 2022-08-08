//created after the controllers/pizza-controllers.js has been created

const router = require("express").Router();

//this brings in the controllers that we've typed out
const {
  getAllPizza,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../../controllers/pizza-controller");

//instead of importing entire object, just import the controlers to the routes below
// Set up GET all and POST at /api/pizzas
router.route("/").get(getAllPizza).post(createPizza);

// Set up GET one, PUT, and DELETE at /api/pizzas/:id
router.route("/:id").get(getPizzaById).put(updatePizza).delete(deletePizza);

module.exports = router;

//after this is set up, need to hook it into the entire server
