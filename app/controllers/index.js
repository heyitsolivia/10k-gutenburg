var express = require('express'),
    router = express.Router();
var Book = require('../models/book');

router.use('/books', require('./books'));

router.get('/', function (req, res, next) {
    var sess = req.session;
    if (!sess.books) {
        sess.books = {};
    }

    var prefix = 'https://d2qrn6phobn81r.cloudfront.net';
    var books = [
        new Book({
            bookId: '1342',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            coverUrl: prefix + '/img/pride_and_prejudice-ee42f8b68e.jpg',
            hasOpened: !!sess.books['1342'],
            lastPage: sess.books['1342']
        }),
        new Book({
            bookId: '1661',
            title: 'Sherlock Holmes',
            author: 'Arthur Conan Doyle',
            coverUrl: prefix + '/img/sherlock_holmes-934a7b7c7d.jpg',
            hasOpened: !!sess.books['1661'],
            lastPage: sess.books['1661']
        }),
        new Book({
            bookId: '84',
            title: 'Frankenstein',
            author: 'Mary Shelley',
            coverUrl: prefix + '/img/frankenstein-6bf90812bd.jpg',
            hasOpened: !!sess.books['84'],
            lastPage: sess.books['84']
        }),
        new Book({
            bookId: '2701',
            title: 'Moby Dick',
            author: 'Herman Melville',
            coverUrl: prefix + '/img/moby_dick-ac4e89bb6a.jpg',
            hasOpened: !!sess.books['2701'],
            lastPage: sess.books['2701']
        }),
        new Book({
            bookId: '98',
            title: 'A Tale of Two Cities',
            author: 'Charles Dickens',
            coverUrl: prefix + '/img/a_tale_of_two_cities-9d0ee670a6.jpg',
            hasOpened: !!sess.books['98'],
            lastPage: sess.books['98']
        }),
        new Book({
            bookId: '345',
            title: 'Dracula',
            author: 'Bram Stoker',
            coverUrl: prefix + '/img/dracula-8c0b9116ff.jpg',
            hasOpened: !!sess.books['345'],
            lastPage: sess.books['345']
        })
    ];

    res.set({'Cache-Control': 'no-cache, no-store, must-revalidate'});
    res.set({'Pragma': 'no-cache'});
    res.set({'Expires': '0'});

    res.render('index', {
        title: 'Gutenberg Collection',
        books: books,
        views: sess.views
    });
});

module.exports = router;
