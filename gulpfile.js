var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("gulp-webserver");
var url = require("url");
var fs = require("fs");
var path = require("path");

var minImg = require("gulp-imagemin");
var uglify = require("gulp-uglify");
var babel = require("gulp-babel");
var minCss = require("gulp-clean-css");
var miniHtml = require('gulp-htmlmin');
//编译sass
gulp.task("sass", function () {
    return gulp.src(["./src/scss/style.scss"])
        .pipe(sass())
        .pipe(gulp.dest("./src/css/"));
})
//监听
gulp.task("watch", function () {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"));
})
//起服务
gulp.task("server", function () {
    gulp.src("./src")
        .pipe(server({
            port: 8090,
            open: true,
            livereload: true,
            middleware(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                pathname = pathname === "/" ? "index.html" : pathname;
                if (pathname === "/favicon.ico") {
                    return res.end()
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, "src", pathname)))
                }

            }
        }))
});
// 压缩html
gulp.task("miniHtml", function () {
    return gulp.src("./src/index.html")
        .pipe(miniHtml({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./dist/"))
})
// 压缩css
gulp.task("minCss", function () {
    return gulp.src("./src/css/*.css")
        .pipe(minCss())
        .pipe(gulp.dest("./dist/css/"))
})
// 压缩js
gulp.task("minJs", function () {
    return gulp.src("./src/ujs/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js/"))
})
gulp.task("babel", function () {
    return gulp.src("./src/js/*.js")
        .pipe(babel({
            presets: 'es2015' //指定编译后的版本为es5
        }))
        .pipe(gulp.dest("./src/ujs/"))
})
// 压缩img
gulp.task("minImg", function () {
    return gulp.src("./src/images/*.{jpg,png,ico,gif}")
        .pipe(minImg({
            optimizationLevel: 5,
        }))
        .pipe(gulp.dest("./dist/images/"))
})

gulp.task("sss",gulp.series("babel","minJs","miniHtml","minCss","minImg"))

gulp.task("dev", gulp.parallel("server", "watch"));