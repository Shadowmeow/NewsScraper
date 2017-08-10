var express = require("express");
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var Article = require("../models/Article");
var Note = require("../models/Note");

var router = express.Router();

router.get("/", function (req, res){
  res.redirect("/scrape");
});

router.get("/scrape", function(req, res) {
  request("http://www.theonion.com", function(error, res, html) {
    var $ = cheerio.load(html);
    var titlesArray = [];

    $("article .inner").each(function(i, element) {
        var result = {};
        result.title = $(this).children("header").children("h2").text().trim() + ""; 
        result.link = "http://www.theonion.com" + $(this).children("header")
          .children("h2").children("a").attr("href").trim();
        result.summary = $(this).children(".desc").text().trim() + ""; 
      
        if(result.title !== "" && result.summary !== ""){
          if(titlesArray.indexOf(result.title) == -1){
            titlesArray.push(result.title);
            Article.count({ title: result.title}, function (err, test){
              if(test == 0){
                var entry = new Article (result);
                entry.save(function(err, doc) {
                  if (err) {
                    console.log(err);
                  } 
                  else {
                    console.log(doc);
                  }
                });
              }
              else{
                console.log("Repeated article.")
              }
            });
          }
          else{
            console.log("Repeated content.")
          }
        }
        else{
          console.log("Empty Content.")
        } 
    });
  });

  res.redirect("/articles");
});

router.get("/articles", function (req, res){
  Article.find().sort({_id: -1}).populate("notes").exec(function(err, doc){
      if (err){
        console.log(err);
      } 
      else {
        var hbsObject = {articles: doc}
        res.render("index", hbsObject);
      }
    });
});

router.post("/add/comment/:id", function (req, res){
  var articleId = req.params.id;
  var result = {
    author: req.body.author,
    body: req.body.note
  };

  var entry = new Note(result);

  entry.save(function(err, doc) {
    if (err) {
      console.log(err);
    } 
    else {
      Article.findOneAndUpdate({"_id": articleId},
      {$set: {"notes":doc._id}}, {new: true})
      .exec(function(err, doc){
        if (err){
          console.log(err);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

router.post("/remove/comment/:id", function (req, res){
  var noteId = req.params.id;

  Note.findByIdAndRemove(noteId, function (err, todo) {      
    if (err) {
      console.log(err);
    } 
    else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;