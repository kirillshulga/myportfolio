const gulp         = require('gulp'),
      sass         = require('gulp-sass'),
      browserSync  = require('browser-sync'),
      del          = require('del'),
      autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
   browserSync({
        server: {
          baseDir: 'app'
        },
        notify: false
   }); 
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
   gulp.watch('app/sass/**/*.scss', ['sass']); 
   gulp.watch('app/*.html', browserSync.reload); 
   gulp.watch('app/js/**/*.js', browserSync.reload); 
});

gulp.task('clean', function() {
   return del.sync('dist'); 
});

gulp.task('build', ['sass'], function() {
    
    let buildCss = gulp.src('app/css/**/*.css')
    .pipe(gulp.dest('dist/css'));
    
    let buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
    
    let buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));
    
    let buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clear', function() {
   return cache.clearAll(); 
});

gulp.task('default', ['watch']);
























