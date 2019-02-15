var gulp = require("gulp");
var sass = require("gulp-sass");
var server = require("gulp-webserver")
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
gulp.task("server",function(){
    gulp.src("./src")
    .pipe(server({
        port:8090,
        open:true,
        livereload:true,
        middleware(req,res,next){
            
        }
    }))
})

gulp.task("dev",gulp.parallel("server","watch"))