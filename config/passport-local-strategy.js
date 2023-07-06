// import passport.js
const passport = require('passport');
// import Strategy property of passport's local library
const LocalStrategy = require('passport-local').Strategy;
// setting up passport to local-Strategy connection

// import user
const User = require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email', //telling that username will be email from our userScehma object   
    passReqToCallback: true // used to set req.flash vlaue
}, function (req, email, password, done) { //find the user and establish identity after process done callback func will be called
    User.findOne({ email: email }).select('+password').then(function (user) { // email(schema) : email(user entered)
        console.log("Here : ", user.password);
        if (!user || user.password != password) { // if user not found 
            req.flash('error', 'Invalid Username/Password !');
            return done(null, false); //done(error, Boolean Value) here its null and false as in user not found
        }
        return done(null, user); //done(error, Boolean Value) here its null and user which is found
    }).catch(function (err) {
        req.flash('error', 'Error in finding user ---> Passport')
        return done(err, false); //done(error, Boolean Value) here its error and false
    });
}));

// serializing the user to store the user info (here id) in the cookie for a session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// deserializing the user in upcoming reqs to identify which user has made the req
passport.deserializeUser(function (id, done) {
    User.findById(id).then(function (user) {
        return done(null, user);
    }).catch(function (err) {
        console.log('Error in finding user ---> Passport');
        return done(err); //done(error, something else) here its error
    });
});

// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if user is signed in, then pass on the req to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if user is not signed in redirect to sign in page
    return res.redirect('/users/sign-in');
}

// send user info to the local for the views
passport.setAuthenticatedUser = function(req, res, next){
    // req.user contains the crnt signed-in user from the session-cookie and we are sending this to the locals for the views
    if(req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}