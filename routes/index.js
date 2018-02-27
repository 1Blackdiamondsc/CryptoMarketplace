var express = require("express");
var router = express.Router();

var passport = require("passport");
request = require("request");

var User = require("../models/user");

// Homepage that loads list of top 100 coins
router.get("/", function(req, res){
  request("https://api.coinmarketcap.com/v1/ticker", function(err, response, coins){
      if(!err && response.statusCode === 200){
          coins = JSON.parse(coins);
          res.render("index", {coins: coins});
      }
  })
})

// Show Profile
router.get('/profile/:username', function(req, res){
  res.send(req.body.user.username);
})

router.get('/signup', function(req, res){
  res.render('signup');
})

// Signup Post Page
router.post('/signup', function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.redirect('/');
      }
      passport.authenticate('local')(req, res, function(){
          console.log(req.body.username);
          res.redirect('/');
      })
  })
})

router.get('/login', function(req, res){
  res.render('login');
})

// Login Post Page
router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login",
}), function(req, res){
  console.log(req.body.user.username);
})

// Logout
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
})

module.exports = router;