var express = require("express");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var Article = require("../models/Article");
var Note = require("../models/Note");

var router = express.Router();

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/mongoNews");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.get("/scrape", function(req, res) {

  request("http://www.echojs.com/", function(error, response, html) {

    var $ = cheerio.load(html);

    $("article h2").each(function(i, element) {

      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });
    });
  });
  res.send("Scrape Complete");
});