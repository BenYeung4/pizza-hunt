//dependencies
const { Schema, model, Types } = require("mongoose");
//always need this if we are doing the get: for the date
const dateFormat = require("../utils/dateFormat");

//this is the model for the reply in the comment section
const ReplySchema = new Schema(
  {
    //set custom id to avoid consuion with the parent comment _id
    replyId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    replyBody: {
      type: String,
      required: true,
      trime: true,
    },
    writtenBy: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      //getter is typically a special type of function taht takes the stored data youve already looking to retrieve and modifyies or formats it upon return.  in this case we are using the dateFormat
      getters: true,
    },
  }
);

const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      //trim removes empty white space befor and after the input string, very useful with username and paassword data
      trim: true,
    },
    commentBody: {
      type: String,
      required: true,
      //trim removes empty white space befor and after the input string, very useful with username and paassword data
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    //the replies connects with the ReplySchema, the replies field populates with an array of data that adheres to the ReplySchema definition
    //this replies will be nested directly in a comment's document and not referred to. used ReplySchema to validate data for a reply
    replies: [ReplySchema],
  },
  {
    toJSON: {
      //to show the amount of comments with the CommentSchema.virtual
      virtuals: true,
      //getter is typically a special type of function taht takes the stored data youve already looking to retrieve and modifyies or formats it upon return.  in this case we are using the dateFormat
      getters: true,
    },
    //set to false because this is a virtual that Mongoose returns, we dont need
    id: false,
  }
);

//get total count of comments and replies on retrieval
CommentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

const Comment = model("Comment", CommentSchema);

module.exports = Comment;
