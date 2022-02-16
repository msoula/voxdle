const gulp        = require('gulp');
const babel       = require('rollup-plugin-babel');
const browserSync = require('browser-sync').create();
const cleanCSS    = require('gulp-clean-css');
const commonjs    = require('rollup-plugin-commonjs');
const concat      = require('gulp-concat');
const footer      = require('gulp-footer');
const gzip        = require('gulp-gzip');
const htmlmin     = require('gulp-htmlmin');
const resolve     = require('rollup-plugin-node-resolve');
const rollup      = require('gulp-better-rollup');
const tar         = require('gulp-tar');
const uglify      = require('gulp-uglify-es').default;
const usemin      = require('gulp-usemin');

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({server: ['./node_modules/@fortawesome', './public']});
});

gulp.task('watch', function() {
    // Reloads the browser whenever HTML or CSS files change
    gulp.watch('public/*.html', browserSync.reload);
    gulp.watch('public/assets/**/*.css', browserSync.reload);
    gulp.watch('public/js/**/*.js', browserSync.reload);
});

gulp.task('minify-html', function() {
    return gulp.src([
        'public/index.html'
    ]).pipe(usemin({
        path: 'public',
        html: [ () => htmlmin({collapseWhitespace: true}) ],
        js  : [
            () => footer(';/*EOF*/;'),
            'concat',
            () => uglify({
                compress: {drop_console: true},
                mangle: {toplevel: true},
                module: true
            })
        ],
        css : [ cleanCSS ],
    })).pipe(gulp.dest('dist/voxdle'));
});

gulp.task('minify-js', function() {
    return gulp.src('public/js/**/*.js', {base: 'public'})
        .pipe(concat('js/app.js'))
        .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
        .pipe(uglify({
            compress: {drop_console: true},
            ecma: 2016,
            mangle: {toplevel: true},
            module: true
        }))
        .pipe(gulp.dest('dist/voxdle'));
});

gulp.task('minify-css', function() {
    return gulp.src('public/assets/css/style.css', {base: 'public'})
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/voxdle'));
});

gulp.task('copy-assets', function() {
    var paths = [
        'public/favicon.ico',
        'public/robots.txt',
        'public/sitemap.xml',
        'public/assets/words-en.json',
        'public/assets/words-fr.json',
        'public/assets/img/**/*',
        'public/assets/snd/**/*'
    ];
    return gulp.src(paths, {base: 'public'}).pipe(gulp.dest('dist/voxdle'));
});

gulp.task('copy-webfonts', function() {
    var paths = [
        'node_modules/@fortawesome/fontawesome-free/webfonts/**/*'
    ];
    return gulp.src(paths, {base: 'node_modules/@fortawesome/fontawesome-free'}).pipe(gulp.dest('dist/voxdle/assets'));
});

gulp.task('export', function() {
    return gulp.src('dist/voxdle/**/*', {base: 'dist'})
        .pipe(tar('dist/voxdle.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('.'))
})

// Run everything
gulp.task('default', gulp.series('browserSync', 'watch'));

// Prepare distribution directory
gulp.task('minify', gulp.series('minify-html', 'minify-js', 'minify-css'));
gulp.task('dist', gulp.series('minify', 'copy-assets', 'copy-webfonts', 'export'));
