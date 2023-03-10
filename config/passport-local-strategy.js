const passport = require('passport');
//const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')


// authintacation using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
  }, async function (email, password, done) {
    try {
      // find a user and establish the identity
      const user = await User.findOne({ email: email });
      if (!user || user.password !== password) {
        console.log('Invalid Username/ Password');
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      console.log('Error in finding user --> Passport');
      return done(err);
    }
  }));
  



// serializing the user to decide which key is to be kept i the cookies 
passport.serializeUser(function (user, done){
    done (null, user.id);
});



// deserialixing the user from the key in the cookies
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    return done(null, user);
  } catch (err) {
    console.log('Error in finding user --> Passport');
    return done(err);
  }
});

// check if the user is authenticated
passport.checkAuthentication = async function(req, res, next) {
  try {
    // if the user is signed in, pass on the request to the next function (controller's action)
    if (await req.isAuthenticated()) {
      return next();
    }

    // if the user is not signed in, redirect to the sign-in page
    return res.redirect('/users/sign-in');
  } catch (err) {
    console.log('Error in checking authentication --> Passport');
    return next(err);
  }
};

passport.setAuthenticatedUser = async function(req, res, next) {
  try {
    if (await req.isAuthenticated()) {
      // req.user contains the current signed-in user from the session cookie, and we are just sending it to the locals for the view
      res.locals.user = req.user;
    }
    return next();
  } catch (err) {
    console.log('Error in setting authenticated user --> Passport');
    return next(err);
  }
};

module.exports= passport;