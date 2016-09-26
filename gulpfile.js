var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');
var del = require('del');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var awspublish = require('gulp-awspublish');
const autoprefixer = require('gulp-autoprefixer');

var cloudFrontUrl = 'https://d2qrn6phobn81r.cloudfront.net';

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee nunjucks',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

// Production

gulp.task('clean', function () {
  return del(['dist']);
});

gulp.task('rev', ['clean'], function () {
  return gulp.src(['public/**/*', '!**/*.html', '!**/*.txt', '!**/*.ico', '!**/*.scss', '!**/*.json'])
      .pipe(rev())
      .pipe(gulp.dest('dist/'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('dist/'));
});

gulp.task('copyviews', ['rev'], function () {
  return gulp.src(['app/views/**/*'])
      .pipe(gulp.dest('dist/views/'));
});

gulp.task('copybooks', ['copyviews'], function () {
  return gulp.src(['public/books/**/*'])
      .pipe(gulp.dest('dist/books/'));
});

gulp.task('cssmin', ['copybooks'], function () {
  return gulp.src(['dist/css/*.css'])
      .pipe(cssmin())
      .pipe(gulp.dest('dist/css'));
});

gulp.task('uglifyjs', ['cssmin'], function () {
  return gulp.src(['dist/js/*.js'])
      .pipe(uglify({
        preserveComments: 'license',
        mangle: true
      }))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('revreplace', ['uglifyjs'], function () {
  return gulp.src(['dist/views/**/*'])
      .pipe(revReplace({
        manifest: gulp.src('dist/rev-manifest.json'),
        replaceInExtensions: ['.nunjucks'],
        prefix: cloudFrontUrl
      }))
      .pipe(gulp.dest('dist/views'));
});

gulp.task('revreplacejs', ['revreplace'], function () {
  return gulp.src(['dist/js/**/*'])
      .pipe(revReplace({
        manifest: gulp.src('dist/rev-manifest.json'),
        replaceInExtensions: ['.js'],
        prefix: cloudFrontUrl
      }))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('publish', ['revreplacejs'], function () {
    var publisher = awspublish.create({
        params: {
            Bucket: '10k-gutenberg'
        }
    });

    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    return gulp.src('dist/**/*')
        // gzip, Set Content-Encoding headers and add .gz extension
        .pipe(awspublish.gzip({}))

        // publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))

        // create a cache file to speed up consecutive uploads
        .pipe(publisher.cache())

        // print upload updates to console
        .pipe(awspublish.reporter());
});

gulp.task('teardown', ['publish'], function () {
    return del([
        'dist/books',
        'dist/components',
        'dist/css',
        'dist/img',
        'dist/js',
        'dist/rev-manifest.json'
    ]);
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);

gulp.task('build:production', ['teardown']);
