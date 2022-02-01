import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';

// Styles
export const styles = () => {
  return gulp.src('source/less/style.less', {sourcemaps:true})
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', {sourcemaps:'.'}))
    .pipe(gulp.dest('source/css', {sourcemaps:'.'}))
    .pipe(browser.stream());
}

//html

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('build'));
}

//IMG
export const optimizeImages = () => {
  return gulp.src('source/img/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

export const optimizeImagesCatalog = () => {
  return gulp.src('source/img/catalog/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img/catalog'));
}

// webp

export const Webp = () => {
  return gulp.src('source/img/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'));
}

export const WebpCatalog = () => {
  return gulp.src('source/img/catalog/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img/catalog'));
}

//SVG
export const svg = () => {
  return gulp.src(['source/img/*.svg', '!source/img/icons/*.svg', '!source/img/sprite.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

/*
export const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}*/

// Copy

export const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/img/sprite.svg',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Clean

export const clean = () => {
  return del('build');
};

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  optimizeImagesCatalog,
  gulp.parallel(
    styles,
    html,
    svg,
    Webp,
    WebpCatalog
  ),
);

export default gulp.series(
  clean,
  copy,
  optimizeImages,
  optimizeImagesCatalog,
  gulp.parallel(
    styles,
    html,
    svg,
    Webp,
    WebpCatalog
  ),
  gulp.series(
    server,
    watcher
));
