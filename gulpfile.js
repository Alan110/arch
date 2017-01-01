var gulp = require('gulp'),
    rollup = require('gulp-rollup');

gulp.task('default', function() {
    gulp.src('./src/**/*.js')
        // transform the files here. 
        .pipe(rollup({
            // any option supported by Rollup can be set here. 
            entry: './src/main.js'
        }))
        .pipe(gulp.dest('./output'));
});
