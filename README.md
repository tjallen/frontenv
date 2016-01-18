# a reasonably nice front end build setup
- build tool: gulp
- package manager: npm

## Stuff it has:
- browsersync
- css preprocessing (gulp-sass)
- minification of styles (gulp-cssnano), scripts (gulp-uglify), images (gulp-imagemin)
- autoprefixer (gulp-autoprefixer)
- modernizr (gulp-modernizr)
- use either neat or bootstrap's grid (node-neat, bootstrap-sass)
- bourbon mixin library (node-bourbon)
- normalize.css (node-normalize-scss)
- inject minified svg sprite sheets (gulp-svgmin/svgstore) & scripts (gulp-inj)

## Setup:
- clone the repo
- `npm install`

## Usage:
- Working directory: app/
- Build/deploy directory: dist/

### Commands:
- `gulp serve` (starts connect web server, browsersync, watches for changes to html, styles, scripts, icons, etc)
- `gulp build` (pipes a production/deploy ready build to dist/)
- `gulp icons` (inject svg icons into sprite sheet)
- `gulp inj` (inject styles, scripts/vendor/*, scripts/* -> index.html)
- `gulp` (default task -- serve)
