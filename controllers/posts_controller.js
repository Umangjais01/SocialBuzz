const Post = require('../models/post')
const Comment = require('../models/comment')
const Like= require('../models/like');

module.exports.create = async function(req, res){
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        return res.redirect('back');
    } catch (err) {
        console.log('error in creating a post:', err);
        return;
    }
}

module.exports.destroy = async function(req, res) {
  try {
    const post = await Post.findById(req.params.id);
   // console.log(post);
    if (post.user == req.user.id) {
     //Change for likes
     await Like.deleteMany({likeable: post , onModel:'Post'});
     await Like.deleteMany({_id: {$in: post.Comments}})

       post.remove();
      
      await Comment.deleteMany({ post: req.params.id });
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
}
