const Post = require('../models/post');
const User = require('../models/user');


// Asynchronous function
module.exports.home = async function(req, res){
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
    const users = await User.find({}).exec();
    return res.render('home', {
      title: "SocialBuzz | Home",
      posts:  posts,
      all_users: users
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
}


// module.exports.actionName = function(req, res){}