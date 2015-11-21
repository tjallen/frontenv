# frontenv
## tja frontend build system

Remaking my gulp build system again to replace old bloated/crap ones

---

Setup:
- clone
- npm install

---

Commands:
- watch: browserSync->sass
- build: clean->sass->useref->images
- default: sass->browserSync->watch

---

"devDependencies": {
  "browser-sync": "^2.10.0",
  "del": "^2.1.0",
  "gulp": "^3.9.0",
  "gulp-autoprefixer": "^3.1.0",
  "gulp-cache": "^0.4.0",
  "gulp-if": "^2.0.0",
  "gulp-imagemin": "^2.4.0",
  "gulp-minify-css": "^1.2.1",
  "gulp-plumber": "^1.0.1",
  "gulp-sass": "^2.1.0",
  "gulp-sourcemaps": "^1.6.0",
  "gulp-uglify": "^1.5.1",
  "gulp-useref": "^3.0.1",
  "gulp-util": "^3.0.7",
  "node-bourbon": "^4.2.3",
  "node-neat": "^1.7.2",
  "run-sequence": "^1.1.5"
}

---

Future stuff to make a possible return
- gulp-changed
- Babel
- Browserify
- template engine stuff
- require-dir
- gulp-modernizr
- unCSS
- CSSO