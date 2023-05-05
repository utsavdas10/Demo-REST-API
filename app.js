const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/WikiDB');

const articleSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: true
    },
    content:{
      type: String,
      required: true
    }
  }
);

const Article = mongoose.model('Article', articleSchema);




// -------------------------------ALL ARTICLES---------------------------------------------

app.route('/articles')
  .get(function(req, res){
    Article.find({}).then(function(foundArticles){
      if(foundArticles.length == 0){
        res.send("Error Retrieving File");
      }
      else{
        res.send(foundArticles);
      }
    })
  })
  .post(function(req, res){
    const article = new Article(
      {
        title: req.body.title,
        content: req.body.content
      });
      article.save().then(function(result){
        if(result == null){
          res.send("Error Retrieving data");
        }
        else{
          res.send(result);
        }
      })
  })
  .delete(function(req, res){
    Article.deleteMany({}).then(function(deleteStatus){
      if(deletedArticles.acknowledged == false){
        res.send("Cannot Delete");
      }
      else{
        res.send(deleteStatus);
      }
    })
  });






// -----------------------------SPECIFIC ARTICLES---------------------------------------

app.route('/articles/:articleTitle')
  .get(function(req, res){
    const requestedArticleTitle = req.params.articleTitle;
    Article.findOne({title: requestedArticleTitle}).then(function(foundArticle){
      if(foundArticle == null){
        res.send('Requested Article Not found');
      }
      else{
        res.send(foundArticle);
      }
    });
  })
  .patch(function(req, res){
    const requestedArticleTitle = req.params.articleTitle;
    Article.updateOne(
      {title: requestedArticleTitle},
      {$set: req.body},
    ).then(function(result){
      if(result.acknowledged == true){
        res.send('Document Updated');
      }
      else{
        res.send("Error updating document");
      }
    });
  })
  .delete(function(req, res){
    const requestedArticleTitle = req.params.articleTitle;
    Article.deleteOne({title: requestedArticleTitle}).then(function(result){
      if(result.acknowledged === true){
        res.send('Document with title '+ requestedArticleTitle +' has been Deleted')
      }
      else{
        res.sendFile("Error deleting document");
      }
    });
  });





app.listen(3000, function() {
  console.log("Server started on port 3000...");
});