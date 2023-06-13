const Post = require('../../../models/post');
const Comment= require('../../../models/comment')


module.exports.index = async function(req,res){

    const posts = await Post.find({})
  //    .sort('-createdAt')
      .populate('user',"-password")
      .populate({
          path: 'comments',
          populate: {
              path: 'user',
              select: 'name'
          },
          options:{sort:{createdAt:-1}}

      });

       res.status(200).json({
        message: "List of posts",
        posts: posts
    });

    // return res.json(200, {
    //     message : "List of posts",
    //     posts: posts
    // })
}

module.exports.destroy = async function(req, res) {
    try {
      let post = await Post.findById(req.params.id);

      if(post.user == req.user.id){

          post.remove();
          
          await Comment.deleteMany({ post: req.params.id });
          return res.status(200).send('Post and associated comments deleted successfully..!')
        }
        else {
            return res.json(401,{
                message: "You cannot deelete this post..!"
            })
        }
        
    }catch (err) {
            console.log('***', err);
      return res.status(500).send('Internal Server Error');
     }
    }
  
  