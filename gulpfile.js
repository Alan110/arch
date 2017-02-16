var gulp = require('gulp'),
    //rename = require('gulp-rename'),
    rollup = require('gulp-better-rollup'),
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    babel = require('rollup-plugin-babel');


gulp.task('js-dev', function() {
    gulp.src('./src/main.js')
//	.pipe(sourcemaps.init())
	    // transform the files here. 
	    .pipe(rollup({
		// any option supported by Rollup can be set here. 
		plugins: [babel()]
	    },{
		'format' : 'umd',
		'moduleName' : 'arch'
	    }))
	    //.pipe(replace('ENV',process.env.ENV))
//	.pipe(sourcemaps.write())
        .pipe(gulp.dest('./output/'));
});

gulp.task('js-pub', function() {
    gulp.src('./src/main.js')
	.pipe(sourcemaps.init())
	    // transform the files here. 
	    .pipe(rollup({
		// any option supported by Rollup can be set here. 
		plugins: [babel()]
	    },{
		'format' : 'umd',
		'moduleName' : 'arch'
	    }))
	    //.pipe(replace('ENV',process.env.ENV))
	.pipe(sourcemaps.write())
        .pipe(gulp.dest('./output/'));
});

gulp.task('watch',function(){
    var watcher = gulp.watch('./src/**/*.js',['js-dev']);
});

gulp.task('default',['js-dev','watch']);
