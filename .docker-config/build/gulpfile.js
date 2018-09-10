var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var svgSprite = require('gulp-svg-sprite');
var spritesmith = require('gulp.spritesmith');
var csso = require('gulp-csso');
var merge = require('merge-stream');
var rsp = require('remove-svg-properties').stream;
var fs = require('file-system');
var assetVersion = fs.readFileSync("src/assetversion", "ascii").trim();


/********** Jobs ***********/

var scssSrc  = 'src/assets/scss/styles.scss';
var scssWatch  = 'src/assets/scss/**/*.scss';
var scssDest = 'src/public/assets/css';

var jsFiles = ['src/assets/js/**/*.js'];
var jsDest  = 'src/public/assets/js';

var imageFiles = ['src/assets/images/**/*'];
var imageDest  = 'src/public/assets/images';

var svgFiles = ['src/assets/svgSprites/**/*.svg'];
var svgDest  = 'src/public/assets/sprites';

var pngFiles = ['src/assets/pngSprites/**/*.png'];
var pngDest  = 'src/public/assets/sprites';
var pngSassDest  = 'src/assets/scss';


var templateWatch = 'src/templates/**/*';


gulp.task('scss', function() {
	return gulp.src(scssSrc)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(sourcemaps.init())
		.pipe(sass({ errLogToConsole: true, outputStyle: 'compressed' }))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(scssDest))
		.pipe(browserSync.stream({match: "**/*.css"}));
});

gulp.task('js', function() {
    return gulp.src(jsFiles)
    	.pipe(plumber({
				errorHandler: onError
			}))
      .pipe(concat('scripts.js'))
      .pipe(uglify())
      .pipe(gulp.dest(jsDest))
			.pipe(browserSync.reload({stream:true}))
			;
});

gulp.task('images', function() {
	return gulp.src(imageFiles)
		  .pipe(plumber({
			  errorHandler: onError
		  }))
		  .pipe(changed(imageDest))
      .pipe(imagemin())
      .pipe(gulp.dest(imageDest))
			.pipe(browserSync.stream({match: "**/*.[jpg|png|gif|webp]"}));

});

gulp.task('svg-sprites', function() {
	return gulp.src(svgFiles)
		  .pipe(plumber({
			  errorHandler: onError
		  }))
			.pipe(rsp.remove({
        properties: [rsp.PROPS_FILL, rsp.PROPS_STROKE]
    	}))
		  .pipe(svgSprite(
				{
					shape				: {
						dimension		: {			// Set maximum dimensions
							maxWidth	: 32,
							maxHeight	: 32
						},
						spacing			: {			// Add padding
							padding		: 2
						},
						dest			: 'out/intermediate-svg'	// Keep the intermediate files
					},
					mode				: {
						symbol			: {			// Activate the «view» mode
							bust		: false,
							dest    : ".",
					 		sprite  : "svg-sprite.svg"
						}
					}
				}
			))
      .pipe(gulp.dest(svgDest))
			.pipe(browserSync.stream({match: "**/*.svg"}));

});

gulp.task('png-sprites', function() {
	var spriteData = gulp.src(pngFiles)
	  .pipe(plumber({
		  errorHandler: onError
	  }))
	  .pipe(spritesmith({
	    imgName: 'sprite.png',
			retinaImgName: 'sprite@2x.png',
			imgPath: '../sprites/sprite.png?v='+assetVersion,
			retinaImgPath: '../sprites/sprite@2x.png?v='+assetVersion,
	    cssName: '_png-sprites.scss',
			padding: 2,
			retinaSrcFilter: ['**/*@2x.png']
	  }));

	var imgStream = spriteData.img
		.pipe(plumber({
			errorHandler: onError
		}))
	  .pipe(buffer())
	  .pipe(imagemin())
	  .pipe(gulp.dest(pngDest));

	var cssStream = spriteData.css
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(gulp.dest(pngSassDest));

	return merge(imgStream, cssStream);

});

/********** Entry Points ***********/

gulp.task('reload', function(){
	return gulp.src(templateWatch)
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('build', ['png-sprites','svg-sprites','images', 'scss', 'js'], function() {

});

gulp.task('watch', ['browser-sync'], function() {
  	gulp.watch(scssWatch, ['scss']);
  	gulp.watch(jsFiles, ['js']);
		gulp.watch(imageFiles, ['images']);
		gulp.watch(svgFiles, ['svg-sprites']);
		gulp.watch(pngFiles, ['png-sprites']);
		gulp.watch(templateWatch, ['reload']);

});


/********** Helpers ***********/

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "nginx"
    });
});

var onError = function (error) {

	var message = '<div style="text-align:left;">' +
									'<div style="font-weight:bold;color:red;margin-bottom: 5px;">TASK FAILED [' + error.plugin + ']</div>' +
									'<div>' + error.relativePath + ' : ' + error.line + '</div>' +
									'<div>' + error.messageOriginal + '</div>' +
								'</div>';

	console.log(error.toString());
	browserSync.notify(message, 10000);
	this.emit('end');
};
