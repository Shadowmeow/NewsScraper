var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");
var port = process.env.PORT || 3000;

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//Morgan logging
app.use(logger("dev"));
//Bodyparser settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(__dirname + "/public"));

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

if(process.env.NODE_ENV == "production"){
  mongoose.connect("");
}
else{
  mongoose.connect('mongodb://localhost/news-scraper');
  connect('mongodb://heroku_60zpcwg0:ubn0n27pi2856flqoedo9glvh8@ds119578.mlab.com:19578/heroku_60zpcwg0');
}

var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

var routes = require('./controller/news.js');
app.use('/',routes);
//In case of site down
app.use(function(req, res) {
  res.render('404');
});

app.listen(port, function() {
  console.log("App running on port 3000!");
});
