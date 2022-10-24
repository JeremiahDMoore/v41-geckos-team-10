const router = require("express").Router();
const passport = require("passport");
const passwordUtil = require("../lib/passwordUtil");
const User = require("../models/userModel");
const isAuth = require("./auth").isAuth;

//Post Routes
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const { hash, salt } = passwordUtil.genPassword(password);

  const newUser = new User({
    email: email,
    hash: hash,
    salt: salt,
  });

  newUser
    .save()
    .then((user) => console.log(user))
    .catch((err) => console.log(err));
});

//req.body includes the email and password
//req.user is the user object from the database
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  //logout the user
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/"); //redirect to the home page
  });
});

router.get("/login-success", (req, res, next) => {
  //if the user is authenticated, redirect to the protected route
  res.send("You have successfully logged in.");
});

router.get("/login-failure", (req, res, next) => {
  //if the user is not authenticated, redirect to the login page
  res.send("You entered the wrong password.");
});

module.exports = router;
