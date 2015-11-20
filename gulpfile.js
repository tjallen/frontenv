var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// sass
gulp.task('sass', function() {
	return gulp.src('app/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
			}))
});

// watch (css,js,html)
gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
})

// browsersync
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
	})
})

// useref (html, js uglify, css minify)
gulp.task('useref', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', minifyCss()))
		.pipe(gulp.dest('dist'));
});

// images
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
	// cache images
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

// clean dist dir (add images exclusion back if needed)
gulp.task('clean', function(callback) {
	del('dist/*');
	return cache.clearAll(callback);
})

// build (clean->sass->useref->images)
gulp.task('build', function (callback) {
	runSequence('clean', 
		['sass', 'useref', 'images'],
		callback
	)
})

// default (sass->bs->watch atm)
gulp.task('default', function (callback) {
	runSequence(['sass','browserSync', 'watch'],
		callback
	)
})

/*
future stuff to add back in:
autoprefixr
sourcemaps
gulp-changed
Babel
Browserify
template engine stuff
require-dir
gulp-modernizr

unCSS
CSSO*/
