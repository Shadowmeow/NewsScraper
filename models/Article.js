var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },

  updated: {
    type: Date,
    default: Date.now
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
