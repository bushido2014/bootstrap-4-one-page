var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var uglify      = require('gulp-uglifyjs');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var del         = require('del');
var cache       = require('gulp-cache');
var htmlmin = require('gulp-htmlmin');
var purify       = require('gulp-purifycss');

gulp.task('sass', function() {
  return gulp.src('scss/*.scss')
  .pipe(sass())
  .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
  .pipe(browserSync.reload({stream:true}))
  .pipe(cssnano())
    .pipe(rename({suffix: '.min'})) 
    .pipe(gulp.dest('css'));
});
gulp.task('scripts', function() {
 return gulp.src([

'bower_components/jquery/dist/jquery.min.js',
'bower_components/bootstrap/dist/js/bootstrap.min.js',



  ])
.pipe(concat('libs.min.js'))
 .pipe(uglify())
 .pipe(gulp.dest('js'));
});
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: {
            baseDir: "./"
        },
     notify: false
    });
});  

gulp.task('purify', function() {
  return gulp.src('css/app.min.css').
    pipe(purify(['./*.html'])).
    pipe(gulp.dest('dist/css'));
});

gulp.task('clean', function() {
return del.sync('dist');
});
gulp.task('clear', function() {
return cache.clearAll();
});
gulp.task('img', function() {
return gulp.src('img/**/*')
.pipe(cache(imagemin({
  interlaced: true,
  progressive: true,
  svgoPlugins: [{ removeViewBox: false}],
  une: [pngquant()]
}))).pipe(gulp.dest('dist/img'));

});
gulp.task('minify', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


 gulp.task('default', ['sass', 'serve', 'scripts'], function() {
    gulp.watch("scss/*.scss", ['sass']).on("change", browserSync.reload);
    gulp.watch("js/**/*.js").on("change", browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
});



gulp.task('prod', ['clean', 'img','sass','scripts','minify','purify'], function() {

    var prodCss = gulp.src([
      'css/app.min.css'
    ]).pipe(purify(['./*.html'])).pipe(gulp.dest('dist/css'));

    var prodFonts = gulp.src('fonts/**/*').pipe(gulp.dest('dist/fonts'));

    var prodJS = gulp.src('js/**/*').pipe(gulp.dest('dist/js'));
    var prodHtml = gulp.src('./*.html').pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));




});

