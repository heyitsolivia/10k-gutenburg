function Book (opts) {
    if(!opts) opts = {};
    this.bookId = opts.bookId || '';
    this.title = opts.title || '';
    this.author = opts.author || '';
    this.publicationYear = opts.publicationYear || '';
    this.coverUrl = opts.coverUrl || '';
    this.hasOpened = opts.hasOpened || false;
    this.lastPage = opts.lastPage || 1;
}

module.exports = Book;
