const User = require('../models/user');


// Asynchronous function
module.exports.profile = async function(req, res){
  try {
    const user = await User.findById(req.params.id).exec();
    return res.render('user_profile', {
      title: 'User Profile',
      profile_user: user
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
}


// Asynchronous function
module.exports.update = async function(req, res){
  try {
    if (req.user.id == req.params.id) {
      const user = await User.findByIdAndUpdate(req.params.id, req.body).exec();
      return res.redirect('back');
    } else {
      return res.status(401).send('Unauthorized');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
}

// render the sign up page
module.exports.signUp = async function(req, res) {
   try {
    if(req.isAuthenticated()){
      return res.redirect(`/users/profile/${req.user.id}`);
    }
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
    if(req.isAuthenticated()){
      return res.redirect(`/users/profile/${req.user.id}`);
    }
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
     return res.redirect(`/`);
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
