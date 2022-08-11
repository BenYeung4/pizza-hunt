//created after the controllers/comment-controller
const router = require("express").Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require("../../controllers/comment-controller");

// /api/comments/<pizzaId>
router.route("/:pizzaId").post(addComment);

// /api/comments/<pizzaId>/<commentId>
// added the addReply function, since we are not creating a new reply resource, instead, we're just updating the existing comment resourcce.
router.route("/:pizzaId/:commentId").put(addReply).delete(removeComment);

//to delete the reply
router.route("/:pizzaId/:commentId/:replyId").delete(removeReply);

module.exports = router;
