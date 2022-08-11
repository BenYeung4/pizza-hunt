const { Comment, Pizza } = require("../models");

//this is the same as the app.get/app.post/app.delete/app.update the CRUD method
const commentController = {
  //add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //$push method adds data to an array
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //adding replies
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //remove reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      //pull operator is from mongoDB to remove the specific reply from he replies array where the replyId matches the value of params.replyId passed in from the route
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => {
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },

  //remove comment
  removeComment({ params }, res) {
    //deletes the document while also returning its data
    Comment.findOneAndDelete({ _id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        //returns the data and use it to identify and remove it from the associated pizza using the Mongo $pull operation
        return Pizza.findOneAndUpdate(
          //return the updated pizza data, without the _id of the comment in the comments array and reutn it to the user
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
