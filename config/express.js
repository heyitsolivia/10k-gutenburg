var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var nunjucks = require('nunjucks');
var minifyHTML = require('express-minify-html');

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  if (app.get('env') === 'development') {
    app.set('views', config.root + '/app/views');
  } else {
    app.set('views', config.root + '/dist/views');
  }

  app.set('view engine', 'nunjucks');

  if (app.get('env') === 'development') {
    nunjucks.configure(config.root + '/app/views', {
      autoescape: true,
      express: app
    });
  } else {
    nunjucks.configure(config.root + '/dist/views', {
      autoescape: true,
      express: app
    });
  }

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());

  if (app.get('env') === 'development') {
    app.use(express.static(config.root + '/public'));
  } else {
    app.use(express.static(config.root + '/dist'));
  }

  app.use(methodOverride());
  app.use(minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
    }
  }));

  app.use(require('../app/controllers'));

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
