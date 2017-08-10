var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");
var port = process.env.PORT || 3000;

var app = express();

app.use(express.static(__dirname + "/public"));
//Morgan logging
app.use(logger("dev"));
//Bodyparser settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

if(process.env.NODE_ENV == "production"){
  mongoose.connect("mongodb://heroku_18kdbb7f:9jecg3e8si4gnpn1j4g5smv3q8@ds029735.mlab.com:29735/heroku_18kdbb7f");
}
else{
  mongoose.connect("mongodb://localhost/news-scraper");
}

var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

var routes = require("./controller/news.js");

app.use("/",routes);

app.listen(port, function() {
  console.log("App running on port 3000!");
});
