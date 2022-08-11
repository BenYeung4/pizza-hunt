//dependencies
const { Schema, model } = require("mongoose");
//from the utils folder
const dateFormat = require("../utils/dateFormat");

//Schema data
//with MongoDB and Mongoose, no need to type the special data types
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      //required is a validator that requires data to be entered in that field
      required: true,
      //trim removes empty white space befor and after the input string, very useful with username and paassword data
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      //if no value was created, then set to current date, this way no need to create the timestamp elsewhere
      default: Date.now,
      //with the get option in place, everytime we retrieve a pizza, the value in the createdAt field ill be formated by the dateFormat() funcation and used instead of the default timestamp value
      //we can use the timestamp value for storage, but use a prettier verssion of it for dispaly
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      required: true,
      //enum stands for enumerable, refers to a set of data that can be iterated over, this provide an array of options that this size field will accept.  If user enters a size that is not listed, the validation simply on't allow it
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
      default: "Large",
    },
    //[] states the empty array as a data type, but can also specify by saying types: Array instead.
    toppings: [],
    //comments is the reference, to keep track of the comments.js
    comments: [
      {
        //the id is connected with the Comment.js, stating where the data is coming from
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      //getter is typically a special type of function taht takes the stored data youve already looking to retrieve and modifyies or formats it upon return.  in this case we are using the dateFormat
      getters: true,
    },
    //set to false because this is a virtual that Mongoose returns, we dont need
    id: false,
  }
);

//get total count of comments and replies on retrieval
PizzaSchema.virtual("commentCount").get(function () {
  //we are using the .reduce() method to tally up the total of evey comment with its replies.  .reduce takes two parameters, an accumulator and currentValue.  in this example, accumulator = total, currentValue = comment.
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

const Pizza = model("Pizza", PizzaSchema);
//export the Pizza Model
module.exports = Pizza;
