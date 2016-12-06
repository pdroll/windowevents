import babelify   from 'babelify';
import browserify from 'browserify';
import buffer     from 'vinyl-buffer';
import del        from 'del';
import gulp       from 'gulp';
import rename     from 'gulp-rename';
import source     from 'vinyl-source-stream';
import uglify     from 'gulp-uglify';

const config = {
    filename: 'windowevents',
};

/**
 * Deletes the /dist/ folder
 */
gulp.task('clean', () => {
    del(`${config.filename}*.js`);
});


/**
 * Builds all of our scripts
 */
gulp.task('scripts', () => {

    // Browserfy Object
    const bundler = browserify({
        entries: 'src/index.js',
        debug: true,
        standalone: config.filename,
    });

    // Transform through Babel
    bundler.transform( 'babelify', {
        presets: ['es2015']
    });

    return bundler.bundle().on('error', (err) => {
        console.error(err);
    })
    // Convert Stream to buffer
    .pipe(source(config.filename + '.js'))
    .pipe(buffer())
    .pipe(gulp.dest('.'))
    .pipe(uglify({ preserveComments : 'license'}))
    .pipe(rename(`${config.filename}.min.js`))
    .pipe(gulp.dest('.'));
});


/**
 * Watches for changes and calls the correct task
 */
gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/*js', ['scripts']);
});


/**
 * Our Default task gets executed when calling gulp.
 */
gulp.task('default', ['clean'], () => {
    gulp.start('scripts');
});
