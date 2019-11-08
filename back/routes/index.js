const express = require("express");
const router = express.Router();
const userRouter = require("./users");
const bookRouter = require("./books");
const User = require("../models/User");
const passport = require("../config/passport");

router.use("/users", userRouter);
router.use("/books", bookRouter);

router.post("/register", function(req, res) {
  User.create(req.body)
  .then(user => {
    res.send(user);
  })
  .catch(err => console.error(err));
});

function isLogedIn(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('AUTHENTICATION SUCCESFUL!')
    res.send(req.user.email);
  } else {
    res.send(false);
  }
}

router.post("/login", function(req, res) {
  passport.authenticate("local", function(err, user, info) {
    if (!user) {
      return res.send(false);
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return res.send(false);
        }
        return res.send(user);
      });
    }
  })(req, res);
});

router.get("/", isLogedIn);
module.exports = router;
