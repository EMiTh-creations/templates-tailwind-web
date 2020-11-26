var gulp = require("gulp");
var del = require("del");
var plugins = require("gulp-load-plugins")();
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var cssmqpacker = require("css-mqpacker");
var pngquant = require("imagemin-pngquant");
var mozjpeg = require("imagemin-mozjpeg");
var browserSync = require("browser-sync").create();

// define source and destination paths
var paths = {
    styles: {
        src: "./src/scss/**/*.scss",
        dest: "./dist/css",
    },
    scripts: {
        src: "./src/js/**/*.js",
        dest: "./dist/js",
    },
    images: {
        src: "./src/images/**/*.{jpg,jpeg,png,svg}",
        dest: "./dist/images",
    },
    static: {
        src: "./src/**/*.{php,html,ini,htaccess,xml,ico,json}",
        dest: "./dist",
    },
};

// define the processors to be run within postcss
var postcssProcessors = [autoprefixer(), cssnano(), cssmqpacker()];

// set the image compression options
var imgOptions = [
    mozjpeg({
        quality: "86",
    }),
    pngquant({
        quality: [0.7, 0.8],
    }),
];

// Styles Processing function. Check for changes, process SASS
// minify, group media queries and remove unused selectors
function styles() {
    return gulp
        .src(paths.styles.src)
        .pipe(plugins.changed(paths.styles.dest))
        .pipe(plugins.sass())
        .pipe(plugins.postcss(postcssProcessors))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// cleaning function. Will usually only be run before build.
function clean() {
    return del(["./dist/.*", "./dist/**/*"]).then((paths) => {
        console.log("Deleted files and folders:\n", paths.join("\n"));
    });
}

// concatenate and uglify javascript
function scripts() {
    return gulp
        .src(paths.scripts.src)
        .pipe(plugins.changed(paths.scripts.dest))
        .pipe(plugins.concat("main.js"))
        .pipe(plugins.terser())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// processing images
function images() {
    return gulp
        .src(paths.images.src)
        .pipe(plugins.changed(paths.images.dest))
        .pipe(
            plugins.imagemin(imgOptions, {
                verbose: true,
            })
        )
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

// copy static files, specifically including dot files like .htaccess.
function static() {
    return gulp
        .src(paths.static.src, {
            dot: true,
        })
        .pipe(plugins.changed(paths.static.dest))
        .pipe(gulp.dest(paths.static.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}

function browser() {
    browserSync.init({
        server: "./dist",
    });

    // gulp.watch("./dist/**/*").on("change", browserSync.reload);
}

// watch task
function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.static.src, static);
}

//define build process, whether tasks run in parallel or series.
var build = gulp.series(clean, static, gulp.parallel(styles, scripts, images));

//define standalone tasks
gulp.task("styles", styles);
gulp.task("clean", clean);
gulp.task("scripts", scripts);
gulp.task("images", images);
gulp.task("static", static);

gulp.task("watch", watch);
gulp.task("browser", browser);
gulp.task("browser-watch", gulp.series(build, gulp.parallel(watch, browser)));

//define build and also set default task as build
gulp.task("build", build);
gulp.task("default", build);
