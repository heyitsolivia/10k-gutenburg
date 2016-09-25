var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  var articles = [new Article(), new Article()];
  res.set({'Cache-Control': 'max-age=86400, must-revalidate'});
  res.render('index', {
    title: '10K Gutenberg',
    articles: articles
  });
});
