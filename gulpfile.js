'use strict';

///////////////////////////////////////
// Required
///////////////////////////////////////

var gulp = require('gulp-param')(require('gulp'), process.argv),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
	reload = browserSync.reload,
	del = require('del'),
	RESTAPI = require('./src/app.js');
	//Start REST API on another port
	RESTAPI.listen(3001);
	console.log('RESTAPI is running on port 3001!');;

///////////////////////////////////////
// Scripts Task
///////////////////////////////////////

gulp.task('scripts', function(){
	gulp.src(['src/js/**/*.js','!src/js/**/*.min.js'])
		.pipe(rename({suffix:'.min'}))
		//.pipe(uglify())
		.pipe(gulp.dest('build/js'))
		.pipe(reload({stream: true}));
});

//

gulp.task('copyBowerFiles', function(){
	gulp.src('bower_components/**/*.min.js')
		.pipe(gulp.dest('build/js'));
})

 
///////////////////////////////////////
// Compass / Sass Task
///////////////////////////////////////

gulp.task('compass', function(){
	gulp.src('src/scss/style.scss')
		.pipe(plumber())
		.pipe(compass({
			css: 'src/css',
			sass: 'src/scss',
			image: 'src/images'
		}))
		.pipe(autoprefixer('last 2 versions'))
    	.pipe(minifyCSS())
		.pipe(gulp.dest('build/css'))
		.pipe(reload({stream: true}));
});


///////////////////////////////////////
// HTML Tasks
///////////////////////////////////////
gulp.task('html', function(){
	gulp.src('src/**/*.html')
		.pipe(gulp.dest('build'))
		.pipe(reload({stream: true}));
})

///////////////////////////////////////
// Copy Images Tasks
///////////////////////////////////////
gulp.task('copyimages', function(){
	gulp.src('src/**/*.png')
		.pipe(gulp.dest('build'))
		.pipe(reload({stream: true}));
})

///////////////////////////////////////
// Watch Task
///////////////////////////////////////

gulp.task('watch', function(){
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/scss/**/*.scss', ['compass']);
	gulp.watch('src/**/*.html', ['html']);
});


///////////////////////////////////////
// BrowserSync Task
///////////////////////////////////////

gulp.task('browser-sync', function() {
	browserSync({
		server:{
			baseDir: './build/'
		}
	});
});


///////////////////////////////////////
// Clean Task
///////////////////////////////////////

gulp.task('clean', function() {
	del([
		'build/**'
	]);
});


///////////////////////////////////////
// Code Generator Task
///////////////////////////////////////

gulp.task('codegen', function(schema) {
	gulp.src('./codegen/test.js')
		.pipe();
	//console.log('inside code generate ' + schema);
	//return;
});

///////////////////////////////////////
// Default Task
///////////////////////////////////////

gulp.task('default', ['scripts', 'copyBowerFiles', 'compass', 'copyimages', 'html', 'browser-sync' ,'watch']);
