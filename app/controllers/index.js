var express = require('express'),
    router = express.Router();

router.use('/books', require('./books'));

router.get('/', function (req, res, next) {
    res.set({'Cache-Control': 'max-age=2678000, must-revalidate'});
    res.render('index', { title: '10K Gutenberg' });
});

module.exports = router;
