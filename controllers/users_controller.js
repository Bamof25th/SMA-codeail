const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// let's keep it same as before
module.exports.profile = function (req, res) {
  User.findById(req.params.id).then(function (user) {
      return res.render('user_profile', {
          title: "Profile",
          profile_user: user
      });
  }).catch(function (error) {
      req.flash('error', "Error in Finding the User in DB");
      console.log(error);
      return res.redirect('back');
  });
}


module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname , '..', user.avatar));
                    }


                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data and create account
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        req.flash('error', "Passwords do not match!");
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }).then(function (user) {
        if (!user) {
            User.create(req.body).then(function (user) {
                req.flash('success', "Account Created Successfully!");
                return res.redirect('/users/sign-in');
            }).catch(function (error) {
                req.flash('error', "Error in storing the User in DB");
                console.log(error);
                return res.redirect('back');
            });
        }
        else {
            return res.redirect('back');
        }
    }).catch(function (error) {
        req.flash('error', "Error in Finding the User in DB");
        console.log(error);
        return res.redirect('back');
    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

// get the sign in data and destroy the session for the user and log out and redirect to home page
module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
      // function from passport to logout the session/user
      if (err) {
        return next(err);
      }
      req.flash("success", "Logged Out Successfully !!"); // flash message
      return res.redirect('/');
    });
  };