var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass');
var del = require('del');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

var cloudFrontUrl = '';

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
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
  return gulp.src(['public/**/*', '!**/*.html', '!**/*.txt', '!**/*.ico', '!**/*.scss'])
      .pipe(rev())
      .pipe(gulp.dest('dist/'))
      .pipe(rev.manifest())
      .pipe(gulp.dest('dist/'));
});

gulp.task('copyviews', ['rev'], function () {
  return gulp.src(['app/views/**/*'])
      .pipe(gulp.dest('dist/views/'));
});

gulp.task('revreplace', ['copyviews'], function () {
  return gulp.src(['dist/views/**/*'])
      .pipe(revReplace({
        manifest: gulp.src('dist/rev-manifest.json'),
        replaceInExtensions: ['.nunjucks'],
        prefix: cloudFrontUrl
      }))
      .pipe(gulp.dest('dist/views'));
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);

gulp.task('build:production', ['revreplace']);
