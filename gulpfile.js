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
var neat = require('node-neat').includePaths;
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var autoPrefixerBrowsers = ['last 2 versions', 'ie 8', 'ie 9', '> 5%'];
var paths = {
	scss: 'app/scss/*.scss'
};
var onErr = function (err) {
	gutil.beep();
	console.log(err);
	this.emit('end');
};

// browsersync
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		options: {
			reloadDelay: 100
		},
		notify: false
	})
});

// SCSS (sourcemaps+autoprefixer+sass)
gulp.task('styles', function() {
	return gulp.src('app/scss/*.scss')
	.pipe(plumber({
		errorHandler: onErr
	}))
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: ['styles'].concat(neat)
	}))
	.pipe(autoprefixer({
		browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 5%'],
		cascade: false
	}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({
		stream: true
		}))
});

// build html
gulp.task('html-build', function() {
	return gulp.src('app/*.html')
	.pipe(plumber({errorHandler: onErr}))
	.pipe(gulp.dest('dist'));
});

// watch html
gulp.task('html', function() {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({stream: true}))
});

// watch (css,js,html)
gulp.task('watch', ['browserSync', 'styles'], function() {
	gulp.watch('app/scss/**/*.scss', ['styles'])
	gulp.watch('app/*html', ['html'])
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

// useref (html, js uglify, css minify)
gulp.task('useref', function() {
	return gulp.src('app/*.html')
	.pipe(plumber({errorHandler: onErr}))
	.pipe(useref())
	.pipe(gulpIf('*.js', uglify()))
	.pipe(gulpIf('*.css', minifyCss()))
	.pipe(gulp.dest('dist'))
});

// images
gulp.task('images', function(){
	return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(plumber({errorHandler: onErr}))
	// cache images
	.pipe(cache(imagemin({
		interlaced: true
	})))
	.pipe(gulp.dest('dist/images'))
});

// clean dist dir (add images exclusion back if needed)
gulp.task('clean', function(callback) {
	del('dist/*');
	return cache.clearAll(callback)
});

// build (clean->styles->useref->images)
gulp.task('build', function (callback) {
	runSequence('clean', 
		['styles', 'useref', 'images', 'html-build'],
		callback
	)
});

// default (styles->bs->watch atm)
gulp.task('default', function (callback) {
	runSequence(['styles','browserSync', 'watch'],
		callback
	)
});