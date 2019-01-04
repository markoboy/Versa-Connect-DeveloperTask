/* eslint-disable no-undef */
var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  useref = require('gulp-useref'),
  gulpIf = require('gulp-if'),
  uglify = require('gulp-uglify'),
  cssnano = require('gulp-cssnano'),
  imagemin = require('gulp-imagemin'),
  htmlmin = require('gulp-htmlmin'),
  babel = require('gulp-babel'),
  del = require('del');


gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './src'
    }
  });
});

gulp.task('browserSync:dist', function () {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
});

gulp.task('useref', function () {
  return gulp.src('src/*.html')
    .pipe(useref())
    // Transpile it to es5 code.
    .pipe(gulpIf('*.js', babel()))
    // Uglify if it is a JS file.
    .pipe(gulpIf('*.js', uglify()))
    // Minify if it is a CSS file.
    .pipe(gulpIf('*.css', cssnano()))
    // Minify if it is a HTML file.
    .pipe(gulpIf('*.html', htmlmin({ collapseWhitespace: true, removeComments: true })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    // Caching images that run through imagemin.
    .pipe(imagemin(
      [
        imagemin.optipng({ optimizationLevel: 6 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ],
      { verbose: true }
    ))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function(done) {
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/css/**/*.css').on('change', browserSync.reload);
  gulp.watch('src/js/**/*.js').on('change', browserSync.reload);
  done();
});

gulp.task('clean:dist', function(done) {
  del.sync('dist');
  done();
});

gulp.task('build', gulp.series(
  'clean:dist',
  gulp.parallel('useref', 'images')
));

gulp.task('default', gulp.parallel('browserSync', 'watch') );

gulp.task('serve:dist', gulp.series(
  'build',
  'browserSync:dist'
));
