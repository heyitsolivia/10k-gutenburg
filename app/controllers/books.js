var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    router = express.Router();

router.get('/:id', function(req, res) {
    var sess = req.session;
    var bookId = req.params.id;
    var pageNumber = req.query.page || 1;

    if (!sess.books) {
        sess.books = {};
    }
    if (!sess.books[bookId] || (sess.books[bookId] < pageNumber)) {
        sess.books[bookId] = pageNumber;
    }
    
    var metadataPath = path.join(__dirname, '..', '..', 'public', 'books', bookId, 'metadata.json');
    var metadata = JSON.parse(fs.readFileSync(metadataPath));

    if (pageNumber < 1) {
        pageNumber = 1;
    }

    if (pageNumber > metadata.pages) {
        pageNumber = metadata.pages;
    }

    var pagePath = path.join(__dirname, '..', '..', 'public', 'books', bookId, 'page.' + pageNumber + '.html');
    var bookPage = fs.readFileSync(pagePath);

    res.render('book', {
        bookId: bookId,
        bookTitle: metadata.title,
        bookAuthor: metadata.author,
        bookPage: bookPage,
        hasPrevious: +pageNumber > 1,
        hasNext: +pageNumber < metadata.pages,
        previousPageUrl: 'books/' + bookId + '?page=' + (+pageNumber - 1),
        nextPageUrl: 'books/' + bookId + '?page=' + (+pageNumber + 1)
    });
});

module.exports = router;
