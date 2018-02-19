// Declare Plugins
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    mongooseRand = require("mongoose-simple-random"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    request = require("request");

// Initiate Plugins
mongoose.connect("mongodb://localhost/cryptomarketplace");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

var logos = {
    BTC: "https://seeklogo.com/images/B/bitcoin-logo-DDAEEA68FA-seeklogo.com.png",
    ETH: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/368px-Ethereum_logo_2014.svg.png",
    BCH: "http://www.forexnewsnow.com/wp-content/uploads/2017/11/Bitcoin-Cash-Green-Logo.png",
    XRP: "https://cdn.worldvectorlogo.com/logos/ripple-2.svg",
    LTC: "https://99bitcoins.com/wp-content/uploads/2013/12/litecoin-logo.png",
    ADA: "https://i.redditmedia.com/OpOZmuyrMp3XX-8gQZWufQAHMX8bgwSbposQG0o50N0.jpg?s=fc4a635ec07c99014646ee4711fd752c",
    MIOTA: "https://cgi.cryptoreport.com/images/coins/miota.svg",
    DASH: "https://cdn-images-1.medium.com/max/1600/1*zna2Zw5JDDnP499Zo3WBQg.png",
    XEM: "https://cdn.worldvectorlogo.com/logos/nem-xem.svg",
    XMR: "https://cdn.worldvectorlogo.com/logos/monero.svg",
    EOS: "https://cdn.worldvectorlogo.com/logos/eos-3.svg",
    BTG: "https://image.freepik.com/free-icon/trash-bin-symbol_318-10194.jpg",
    NEO: "https://neonewstoday.com/wp-content/uploads/2017/09/neo_logo.png",
    QTUM: "https://seeklogo.com/images/Q/qtum-logo-DCA377ECFF-seeklogo.com.png",
    XLM: "https://www.stellar.org/wp-content/themes/stellar/images/stellar-rocket-300.png",
    ETC: "https://raw.githubusercontent.com/ethereumclassic/Media_Kit/master/Classic_Logo_Solid/ETC_LOGO_Full_Color_Green.png",
    XVG: "https://steemitimages.com/DQmSZ19WURpGZR7TjjUTive4LdiYBLpgR5Y2Yik3Vba4pJ4/vergelogo.png",
    LSK: "https://cdn.coinranking.com/SydghSdub/lsk.svg",
    TRX: "https://cdn.worldvectorlogo.com/logos/tron.svg",
    BCC: "https://pbs.twimg.com/profile_images/899849958001709056/J0ziZ2hX.jpg",
    REQ: "https://i.warosu.org/data/biz/img/0054/87/1514298405588.png"
}

// Routes
app.get("/", function(req, res){
    request("https://api.coinmarketcap.com/v1/ticker", function(err, response, coins){
        if(!err && response.statusCode === 200){
            coins = JSON.parse(coins);
            var staffPick = coins.find(function(coin){
                return coin.symbol === "REQ";
            })
            res.render("index", {coins: coins, logos: logos, staffPick: staffPick});
        }
    })
})

app.get("/coin/:id", function(req, res){
    request("https://api.coinmarketcap.com/v1/ticker", function(err, response, coins){
        if(!err && response.statusCode === 200){
            coins = JSON.parse(coins);
            var coin = coins.find(function(coin){
                return coin.id === req.params.id;
            })
            res.render("coin", {coin: coin, logo: logos[coin.symbol]});
        }
    })
})


// Start Server
app.listen(process.env.PORT, process.env.IP, function(){
    console.log(`CryptoMarketplace Server App listening on port ${process.env.IP}:${process.env.PORT}`)
})