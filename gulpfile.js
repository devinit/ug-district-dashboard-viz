const { dest, series, src } = require('gulp');
const del = require('del');
const rename = require('gulp-rename');

function cleaning() {
  return del(['assets/**/*.js', 'assets/**/*.css']);
}

function copy(cb) {
  src('./dist/main*.css').pipe(rename('styles.css')).pipe(dest('./assets'));
  src('./dist/main*.js').pipe(rename('core.js')).pipe(dest('./assets'));
  src('./dist/runtime*.js').pipe(rename('runtime.js')).pipe(dest('./assets'));
  src('./dist/vendor*.js').pipe(rename('vendor.js')).pipe(dest('./assets'));

  cb();
}

exports.default = series(cleaning, copy);
