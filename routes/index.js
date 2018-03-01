var express = require("express");
var router = express.Router();

var passport = require("passport");
var request = require("request");
var numbro = require('numbro');
var fs = require('fs');

var User = require("../models/user");

// Homepage that loads list of top 100 coins
router.get("/", function(req, res){
  request("https://api.coinmarketcap.com/v1/ticker/?limit=100", function(err, response, coins){
      if(!err && response.statusCode === 200){
          coins = JSON.parse(coins);
          for(coin of coins){
            if(fs.existsSync('public/icons/' + coin.symbol + '.png')){
              coin.icon = 'icons/' + coin.symbol + '.png';
            } else {
              coin.icon = 'icons/default.png';
            }
            if(coin.price_usd < 1){
              coin.price_usd = parseFloat(coin.price_usd).toFixed(4);
            } else if(coin.price_usd < 50){
              coin.price_usd = parseFloat(coin.price_usd).toFixed(2);
            } else if(coin.price_usd >= 50){
              coin.price_usd = parseInt(coin.price_usd).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            coin.price_btc = parseFloat(coin.price_btc).toFixed(8);
            coin.market_cap_usd = numbro(coin.market_cap_usd.toString()).format('0a');
          }
          res.render('index', {coins: coins});
      }
  })
})

// Update Favorite Coin
router.post('/favorites', function(req, res){
  let user = req.body.user;
  console.log(req.body.user);
  if(user.favorites.contains(req.body.coin)){
    user.favorites.splice(user.favorites.indexOf(req.body.coin), user.favorites.indexOf(req.body.coin) + 1);
    user.save();
    console.log(user.favorites);
  } else {
    user.favorites.push(req.body.coin);
    user.save();
    console.log(user.favorites);
  }
})

// Show Profile
router.get('/p/:username', function(req, res){
  res.send(req.body.user.username);
})

router.post('/p/:username/favorite', function(req, res){
  let favorites = req.body.user.favorites;
  let found = false;
  favorites.forEach(function(favorite){
    if(!found && favorite === req.body.coin){
      found = true;
      const location = favorites.indexOf(favorite);
      favoirte.splice(location, 1);
    }
  })
  if(!found){
    favorites.push(favorite);
    console.log('coin added');
  }
  user.save();
})

// Render Signup Page Form
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
          res.redirect('/');
      })
  })
})

// Render Login Page Form
router.get('/login', function(req, res){
  res.render('login');
})

// Login Post Page
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
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