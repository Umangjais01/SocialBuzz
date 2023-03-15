const Comment = require('../models/comment');
const Post= require('../models/post');

// Asynchronous
module.exports.create = async function(req, res) {
    try {
        let post = await Post.findById(req.body.post).exec();
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            await post.save();
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
 }
module.exports.destroy = async function(req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    console.log(comment);

    if (comment.user == req.user.id) {
      const postId = comment.post;
       comment.remove();
       Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
}

