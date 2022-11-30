const { dest, series, src } = require('gulp');
const clean = require('gulp-clean');
const rename = require('gulp-rename');

function cleaning(cb) {
  ['assets/**/*.js', 'assets/**/*.css'].forEach((_path) => {
    src(_path, { read: false }).pipe(clean());
  });

  cb();
}

function copy(cb) {
  src('./dist/app*.css')
    .pipe(rename('styles.css'))
    .pipe(dest('./assets'));

  src('./dist/app*.js')
    .pipe(rename('core.js'))
    .pipe(dest('./assets'));

  src('./dist/runtime*.js')
    .pipe(rename('runtime.js'))
    .pipe(dest('./assets'));

  src('./dist/vendor*.js')
    .pipe(rename('vendor.js'))
    .pipe(dest('./assets'));

  cb();
}

exports.default = series(cleaning, copy);
