var express = require("express");
var router = express.Router();

var passport = require("passport");
var request = require("request");
var numbro = require('numbro');
var fs = require('fs');

var User = require("../models/user");

// Get Coins
router.use(function(req, res, next) {
  request('https://api.coinmarketcap.com/v1/ticker/?limit=100', function(err, response, coins){
    if(err){
      console.log(err);
      req.coins = null;
    } else {
      coins = JSON.parse(coins);
      for(coin of coins){
        coin.symbol = coin.symbol.toLowerCase();
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
      req.coins = coins;
    }
    next();
  })
})

// Homepage that loads list of top 100 coins
router.get("/", function(req, res){
  // Make coins request
  let coins = req.coins;
  if(coins){
    // Check if user logged in
    if(req.user){
      console.log(req.user);
      // Check if user has any favorites
      if(req.user.favorites.length > 0){
        let favorites = [];
        // Loop through all coins and see if they are in favorites array, 
        // then remove if so and add to new ordered array and remove
        for(coin of coins){
          for(favorite of req.user.favorites){
            coin.hidden = false;
            if(coin.symbol === favorite){
              favorites.push(coin);
              coin.hidden = true;
              break;
            } else {
              coin.hidden = false;
            }
          }
        }
        return res.render('index', {coins: coins, favorites: favorites});
      }
    }
    return res.render('index', {coins: coins});
  }
})

// Update Favorite Coin
router.post('/favorite', function(req, res){
  User.findById(req.user._id)
  .then(user => {
    console.log(user);
    // If coin is in array, remove
    if(user.favorites.indexOf(req.body.coin) > -1){
      // Remove from array and save
      user.favorites.splice(user.favorites.indexOf(req.body.coin), 1);
      user.save();
      console.log('Coin Removed!');
      res.send('Coin Removed!');
      // If coin isn't in favorites, add
    } else {
      // Add to favorites and save
      user.favorites.push(req.body.coin);
      user.save();
      console.log('Coin Added!');
      res.send('Coin Added!');
    }
  })
  .catch(err => console.log(err));
})

// Show Profile
router.get('/p/:username', function(req, res){
  res.render('profile');
})

// Post porfile edits
router.post('/p/:username', function(req, res){
  
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