const User = require('../models/user');


module.exports.profile = async function(req, res){
   try {
       const userId = req.cookies.user_id;
       if (userId) {
           const user = await User.findById(userId);
           if (user) {
               return res.render('user_profile', {
                   title: 'User Profile',
                   user: user
               });
           } else {
               return res.redirect('/users/sign-in');
           }
       } else {
           return res.redirect('/users/sign-in');
       }
   } catch (err) {
       console.log('Error in rendering user profile page:', err);
       return;
   }
}

// render the sign up page
module.exports.signUp = async function(req, res) {
   try {
     res.render('user_sign_up', {
       title: 'SocialBuzz | Sign Up'
     });
   } catch (err) {
     console.log('Error in rendering sign-up page:', err);
     return;
   }
 };
 
// render the sign in page
module.exports.signIn = async function(req, res) {
   try {
     res.render('user_sign_in', {
       title: 'SocialBuzz | Sign In'
     });
   } catch (err) {
     console.log('Error in rendering sign-in page:', err);
     return;
   }
 };
 

module.exports.create = async function(req, res) {
   try {
     if (req.body.password !== req.body.confirm_password) {
       return res.redirect('back');
     }
 
     const user = await User.findOne({ email: req.body.email }).exec();
     if (user) {
       return res.redirect('back');
     }
 
     const newUser = await User.create(req.body);
     return res.redirect('/users/sign-in');
   } catch (err) {
     console.log('Error in finding or creating user in signup', err);
     return;
   }
 };
 
// sign in and create a session
module.exports.createSession = async function (req, res) {
   try {
     // find the user 
     const user = await User.findOne({ email: req.body.email });
 
     // handle user not found 
     if (!user) {
       return res.redirect('back');
     }
 
     // handle password which dont match
     if (user.password !== req.body.password) {
       return res.redirect('back');
     }
 
     // handle session creation
     res.cookie('user_id', user.id);
     return res.redirect('/users/profile');
   } catch (err) {
     console.log('Error in finding user in signing in');
     return;
   }
};

//  module.exports.createSession = function (req,res){
//     return res.redirect('/');
//  }


// for sign out
module.exports.destroySession = function(req,res){
 req.logout(function(err){
  if(err){
    return next(err);
  }
  return res.redirect('/');
 })
}
