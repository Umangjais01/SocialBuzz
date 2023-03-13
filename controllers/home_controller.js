const Post =  require('../models/post');


// populate of each post
module.exports.home = async function(req, res) {
    try {
      const posts = await Post.find({})
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }

      })
      .exec();
      return res.render('home', {
        title: "SocialBuzz | Home",
        posts: posts
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  };
  