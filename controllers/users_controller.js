const User = require("../models/user");

//render the profile page of a user 
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
module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id){
    try {
          let user = await User.findByIdAndUpdate(req.params.id,  req.body);

          return res.redirect('back');

    }
    catch{
         return res.status(401).send('Unauthorised');

    }

  }
}
// render the sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile/" + req.user.id);
  }

  return res.render("user_sign_up", {
    title: "Codeial | Sign Up",
  });
};

// render the sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile" );
  }

  return res.render("user_sign_in", {
    title: "Codeial | Sign In",
  });
};

module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("back");
  }

  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (!user) {
        User.create(req.body)
          .then(function (user) {
            req.flash("success", "Account Created Successfully!");
            return res.redirect("/users/sign-in");
          })
          .catch(function (error) {
            req.flash("error", "Error in storing the User in DB");
            console.log(error);
            return res.redirect("back");
          });
      } else {
        return res.redirect("back");
      }
    })
    .catch(function (error) {
      req.flash("error", "Error in Finding the User in DB");
      console.log(error);
      return res.redirect("back");
    });
};

// get the sign in data and create a session for the user and redirect to profile page
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully !!"); // flash message
  return res.redirect("/users/profile" );
};

// get the sign in data and destroy the session for the user and log out and redirect to home page
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    // function from passport to logout the session/user
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully !!"); // flash message
    return res.redirect("/");
  });
};

// not using async await scine only onr call is being made per function !!
