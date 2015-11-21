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
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var autoPrefixerBrowsers = ['last 2 versions', 'ie 8', 'ie 9', '> 5%'];

// SCSS (sourcemaps+autoprefixer+sass)
gulp.task('styles', function() {
	return gulp.src('app/scss/*.scss')
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: autoPrefixerBrowsers,
			cascade: false
		}))
		.pipe(sass())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
			}))
});

// watch (css,js,html)
gulp.task('watch', ['browserSync', 'styles'], function() {
	gulp.watch('app/scss/**/*.scss', ['styles']);
	gulp.watch('app/*html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
})

// browsersync
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
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

// build (clean->styles->useref->images)
gulp.task('build', function (callback) {
	runSequence('clean', 
		['styles', 'useref', 'images'],
		callback
	)
})

// default (styles->bs->watch atm)
gulp.task('default', function (callback) {
	runSequence(['styles','browserSync', 'watch'],
		callback
	)
})