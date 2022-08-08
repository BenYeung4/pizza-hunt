const express = require("express");

//import Mongoose
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

//after models/Pizza.js and models/index.js has been added, add the two mongoose.connect & mongoose.set below.  Also the const mongoose above
//mongoose.connect tells Mongoose which database we want to connec to.  if the MONGODB_URI exists, we will use this otherwise use the local mongodb server
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/pizza-hunt",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//Use this to log mongo queries being executed!
mongoose.set("debug", true);

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
