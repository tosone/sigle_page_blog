const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const minifyCSS = require('gulp-minify-css');
const jsonminify = require('gulp-jsonminify');

require('./gen')

let releasePath = "gh-pages"

gulp.task("default", () => {
    gulp.src('public/css/content.less').pipe(less()).pipe(minifyCSS()).pipe(gulp.dest(path.join(releasePath, 'public', 'css')));
    gulp.src('public/css/about.css').pipe(minifyCSS()).pipe(gulp.dest(path.join(releasePath, 'public', 'css')));
    gulp.src('config.json').pipe(jsonminify()).pipe(gulp.dest(path.join(releasePath)));
    gulp.src('data.json').pipe(jsonminify()).pipe(gulp.dest(path.join(releasePath)));
    gulp.src("public/js/*.js").pipe(uglify()).pipe(gulp.dest(path.join(releasePath, 'public', 'js')));
    gulp.src(["server.js", "config.json", "gen.js", "favicon.ico", '.gitignore', 'readme.md']).pipe(gulp.dest(releasePath));
    gulp.src(["public/img/**/*"]).pipe(gulp.dest(path.join(releasePath, 'public', 'img')));
    gulp.src(['index.html', 'about.html']).pipe(htmlmin({
        collapseWhitespace: true
    })).pipe(gulp.dest(releasePath));
    gulp.src("data/**/*").pipe(gulp.dest(path.join(releasePath, "data")));
});