var ts = require("gulp-typescript"),
    gulp = require("gulp"),
    watch = require("gulp-watch"),
    replace = require("gulp-replace"),
    watch = require("gulp-watch"),
    sass = require("gulp-sass"),
    sourceMaps = require("gulp-sourcemaps"),
    cssmin = require("gulp-cssmin"),
    rename = require("gulp-rename"),
    clean = require("gulp-clean"),
    uglify = require("gulp-uglify"),
    htmlmin = require("gulp-html-minifier"),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload;

var wwwroot = "./wwwroot/"
wwwrootLibs = wwwroot + "libs/",
    wwwrootApp = wwwroot + "app/",
    appAllFiles = "app/**/*";

gulp.task("scripts-styles", () => {
    gulp.src([
        "core-js/client/shim.min.js",
        "es6-shim/es6-shim.min.js",
        "systemjs/dist/system-polyfills.js",
        "systemjs/dist/system.src.js",
        "rxjs/**/*.js",
        "zone.js/dist/**.js",
        "@angular/**/*.js",
        "@angular/material/prebuilt-themes/indigo-pink.css",
        "animate.css/animate.min.css",
    ], { cwd: "node_modules/**" })
        .pipe(gulp.dest(wwwrootLibs))
});

gulp.task("serve", function () {
    browserSync.init({
        server: "wwwroot"
    });
});

var tsProject = ts.createProject("tsconfig.json");

gulp.task("ts", function () {
    return gulp.src("./app/**/*.ts")
        .pipe(sourceMaps.init())
        .pipe(tsProject())
        .pipe(sourceMaps.write())
        //  .pipe(uglify())
        .pipe(gulp.dest(wwwrootApp)),

        gulp.src(["./app/**/*.js", "./app/**/*.js.map"])
            .pipe(clean());
});

gulp.task("sass", function () {
    return gulp.src("./app/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(rename({ suffix: ".min" }))
        .pipe(cssmin({ compatibility: "ie8" }))
        .pipe(gulp.dest("./wwwroot/app/"))
        .pipe(browserSync.stream());
});

gulp.task("images", function () {
    return gulp.src([appAllFiles + ".png", appAllFiles + ".jpg", appAllFiles + ".ico"])
        .pipe(gulp.dest(wwwrootApp));
});

gulp.task("html-js", function () {
    return gulp.src("index.html")
        .pipe(replace("node_modules", "libs"))
    //    .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(wwwroot)),

        gulp.src(appAllFiles + ".html")
            .pipe(gulp.dest(wwwrootApp)),

        gulp.src("systemjs.config.js")
            .pipe(rename({ suffix: ".min" }))
            .pipe(uglify())
            .pipe(gulp.dest(wwwroot));
});

gulp.task("watch", ["ts", "html-js", "sass", "serve"], function () {
    gulp.watch(appAllFiles + ".ts", ["ts"]).on("change", reload);
    gulp.watch("./app/**/*.scss", ["sass"]);
    gulp.watch([appAllFiles + ".html", "index.html", "systemjs.config.js"], ["html-js"]).on("change", reload);
});

gulp.task("clean-libs", function () {
    return gulp.src(wwwrootLibs, { read: false })
        .pipe(clean());
});

gulp.task("clean-css", function () {
    return gulp.src(wwwrootApp + "**/*.css", { read: false })
        .pipe(clean());
});

gulp.task("clean-wwwrootApp", function () {
    return gulp.src(wwwrootApp, { read: false })
        .pipe(clean());
});

gulp.task("clean-wwwroot", function () {
    return gulp.src(wwwroot + "**/*", { read: false })
        .pipe(clean());
});

gulp.task("build", ["scripts-styles", "html-js", "ts", "sass", "images"], function () {
});