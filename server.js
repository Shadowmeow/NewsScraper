var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var exphbs = require("express-handlebars");
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

var routes = require('./controller/news.js');
app.use('/',routes);
//In case of site down
app.use(function(req, res) {
  res.render('404');
});

app.listen(port, function() {
  console.log("App running on port 3000!");
});
