/********************************************************
Dependencies
********************************************************/
var gulp = require('gulp');
    $ = require('gulp-load-plugins')();
    browserSync = require('browser-sync');
    del = require('del');
    runSequence = require('run-sequence');
    neat = require('node-neat').includePaths;
    series = require('stream-series');

/********************************************************
Config
********************************************************/
// dev paths
var dev = 'app/';
var paths = {
  js: dev + 'scripts/**/*.js',
  css: dev + 'styles/**/*.css',
  scss: dev + 'styles/**/*.scss',
  html: dev + '**/*.html',
  image: dev + 'images/**/*.+(png|jpg|jpeg|gif|svg)',
  font: dev + 'fonts/**/*',
  icon: dev + 'icons/**/*.svg'
};

// plugin vars
var reload = browserSync.reload;
var autoprefixerBrowsers = [
  'last 3 versions',
  'ie 8',
  'ie 9',
  '> 5%'
];

// better error handling when plumber stops pipes breaking
var onErr = function (err) {
  $.util.beep();
  $.util.log($.util.colors.red(err));
  this.emit('end');
};

/***************************************************
Styles
***************************************************/

// sass+normalize+bourbon/neat, sourcemaps, autoprefixr
gulp.task('styles', function() {
  return gulp.src([
      'app/styles/**/*.scss', 'app/styles/**/*.css'
    ])
    .pipe($.plumber({errorHandler: onErr}))
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer(autoprefixerBrowsers))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.cssnano())
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

/***************************************************
Scripts
***************************************************/

// uglify scripts, add sourcemap, pipe to dist
gulp.task('scripts', function() {
  gulp.src('app/scripts/**/*.js')
    .pipe($.plumber({errorHandler: onErr}))
    .pipe($.sourcemaps.init())
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.sourcemaps.write('.'))
    .pipe($.size({title: 'scripts'}))
    .pipe(gulp.dest('dist/scripts'));
});

/***************************************************
Injecting
***************************************************/

// inject any styles, then scripts, in order, vendor -> scripts
gulp.task('inj', function() {
  // get css
  var styles = gulp.src(['app/styles/**/*.css'] );
  // get vendor scripts
  var vends = gulp.src(['app/scripts/vendor/**/*.js']);
  // get non vendor scripts
  var apps = gulp.src(['!app/scripts/vendor/**/*.js', 'app/scripts/**/*.js']);
  gulp.src('app/index.html')
    .pipe($.plumber({errorHandler: onErr}))
    .pipe($.inject(series(styles, vends, apps), {read: false, relative: true}))
    .pipe(gulp.dest('app'));
});

/***************************************************
Images
***************************************************/

gulp.task('images', function(){
  return gulp.src(paths.image)
    .pipe($.plumber({errorHandler: onErr}))
    // cache images
    .pipe($.cache($.imagemin({
      interlaced: true
    })))
    .pipe($.size({title: 'images'}))
    .pipe(gulp.dest('dist/images'));
});

/***************************************************
Fonts
***************************************************/

gulp.task('fonts', function(){
  return gulp.src(paths.font)
    .pipe($.plumber({errorHandler: onErr}))
    .pipe($.size({title: 'fonts'}))
    .pipe(gulp.dest('dist/fonts'));
});

/***************************************************
Build
***************************************************/

// all html files
gulp.task('html', function() {
  gulp.src('app/**/*.html')
    .pipe($.plumber({errorHandler: onErr}))
    .pipe($.size({title: 'html'}))
    .pipe(gulp.dest('dist'));
});

// all rando files at root including hidden
gulp.task('rootfiles', function() {
  gulp.src(['app/*','!app/*.html', '!app/styles','app/.*'])
    .pipe($.plumber({errorHandler: onErr}))
    .pipe($.size({title: 'misc root files'}))
    .pipe(gulp.dest('dist'));
});

/***************************************************
Main tasks
***************************************************/

// watch (scss/css, js, html, images, icons)
gulp.task('serve', ['scripts', 'styles'], function() {
  // browsersync
  browserSync({
    server: ['.tmp', 'app'],
    options: {
    },
    notify: false
  });
  gulp.watch(['app/styles/**/*'], ['styles']);
  gulp.watch([paths.html], reload);
  gulp.watch([paths.js], ['scripts', reload]);
  gulp.watch([paths.image], reload); // check
  gulp.watch([paths.icon], ['icons', reload]);
});

// clean dist dir (add images exclusion back if needed)
gulp.task('clean', function() {
  del(['dist/*', '.tmp/*', '!dist/.git']);
  return $.cache.clearAll();
});

// build - td: inj after styles if its useful
gulp.task('build', function(callback) {
  runSequence('clean', ['styles', 'scripts'],
  ['html', 'images', 'rootfiles', 'fonts'],
    callback
  );
});

// default task
gulp.task('default', ['serve']);
