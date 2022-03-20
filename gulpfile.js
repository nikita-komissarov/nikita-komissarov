'use strict';

const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const rsync = require('gulp-rsync');
const shell = require('gulp-shell');
const useref = require('gulp-useref');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');
const minify = require('gulp-minify');
const replace = require('@yodasws/gulp-pattern-replace');
const purify = require('gulp-purifycss');

const time = parseInt(new Date().getTime() / 1000);

gulp.task('clean', function () {
	return del(['dist/*']);
});

gulp.task('html', function (data) {
	return gulp
		.src(['src/**/*.html'])
		.pipe(useref({ searchPath: 'src/' }))
		.pipe(gulp.dest('dist'));
});

gulp.task('html_min', function () {
	return gulp
		.src('dist/pages/**/*.html')
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				removeComments: true,
			})
		)
		.pipe(gulp.dest('dist/pages/'));
});

gulp.task('css_min', function () {
	return gulp
		.src('dist/**/*.min.css')
		.pipe(purify(['dist/**/*.js', 'dist/**/*.html']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/'));
});

gulp.task('js_min', function () {
	return gulp
		.src('dist/**/*.js')
		.pipe(
			minify({
				ext: {
					min: '.js',
				},
				noSource: true,
			})
		)
		.pipe(gulp.dest('dist/'));
});

gulp.task('fonts', function () {
	return gulp
		.src('src/assets/fonts/**/*')
		.pipe(gulp.dest('dist/assets/fonts/'));
});

gulp.task('img', function () {
	return gulp
		.src('src/**/*.+(png|jpg|jpeg|gif|svg|ico)')
		.pipe(gulp.dest('dist/'));
});

gulp.task('pwa', function () {
	return gulp
		.src([
			'src/manifest.json',
			'src/sw.js',
			'src/robots.txt',
			'src/sitemap.xml',
		])
		.pipe(gulp.dest('dist/'));
});

gulp.task('version', function () {
	return gulp
		.src('dist/**/*.html')
		.pipe(replace(/min\.css/g, 'min.css?v=' + time))
		.pipe(replace(/min\.js/g, 'min.js?v=' + time))
		.pipe(gulp.dest('dist/'));
});

gulp.task(
	'build',
	gulp.series(
		'clean',
		'html',
		'html_min',
		'css_min',
		'js_min',
		'fonts',
		'img',
		'pwa',
		'version'
	)
);

gulp.task('default', gulp.series('build'));
