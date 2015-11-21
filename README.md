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

Npm packages:
gulp, sass, browserSyc, useref, uglify, gulpIf, minifyCss, imagemin, cache, del, runSequence, autoprefixer, sourcemaps, node-bourbon, node-neat

---

Future stuff to add back in:
- gulp-changed
- Babel
- Browserify
- template engine stuff
- require-dir
- gulp-modernizr
- unCSS
- CSSO