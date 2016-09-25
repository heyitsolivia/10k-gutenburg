var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    router = express.Router();

router.get('/:id', function(req, res) {
    var bookId = req.params.id;
    var pageNumber = req.query.page || 1;

    var pagePath = path.join(__dirname, '..', 'books', '1342', 'page.' + pageNumber + '.html');
    var bookPage = fs.readFileSync(pagePath);

    res.render('book', {
        bookId: bookId,
        bookPage: bookPage,
        previousPageUrl: req.path + '?page=' + (+pageNumber - 1),
        nextPageUrl: req.path + '?page=' + (+pageNumber + 1)
    });
});

module.exports = router;
