import gulp from 'gulp';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { config as webpackConfig } from './webpack';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
import startServer from './server.js';


// Import gulp plugins
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import concat_util from 'gulp-concat-util';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import htmlhint from 'gulp-htmlhint';
import htmlmin from 'gulp-htmlmin';
import watch from 'gulp-watch';
import ftp from 'vinyl-ftp';
import spritesmith from 'gulp.spritesmith';
import svgSprite from 'gulp-svg-sprite';
import merge from 'merge-stream';
import imagemin from 'gulp-imagemin';
import gzip from 'gulp-gzip';
import notify from 'gulp-notify';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import pug from 'gulp-pug';
import cssGlobbing from 'gulp-css-globbing';


const rootPath = './';
const buildPath = rootPath + 'build/';
const browserslist = ['> 1%', 'last 3 versions', 'not ie <= 9'];
const sassFolderName = 'src/styles';
const stylesFolderName = buildPath + 'assets/styles';
const cssFileName = 'main.css';
const imageFilesSrc = [
    rootPath + 'src/images/**/*.+(png|jpg|jpeg|gif|svg)',
    '!' + rootPath + 'src/images/**/*_tmp*.+(png|jpg|jpeg|gif|svg)',
    '!' + rootPath + 'src/images/4sprite/**/*'
    //'!src/images/4sprite/*.+(png|jpg|jpeg|gif|svg)'
];
const imagesDistFolder = buildPath + 'assets/images/';
const svgInlineSpriteIconsSrc = rootPath + 'src/images/svg-icons/*.svg';
const svgCssSpriteIconsSrc = rootPath + 'images/svg-css-icons/*.svg';


// Compile Sass files


const sassCompile = function (src) {
    var start = Date.now();
    gutil.log("Starting '" + gutil.colors.cyan("sassCompile") + "'...");

    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe(sass({ indentWidth: 4 }).on('error', sass.logError))
        // .on('error', onError)
        .pipe(postcss([ autoprefixer({ browsers: browserslist }) ]))
        .pipe(sourcemaps.write(rootPath + 'sourcemaps'))
        .pipe(gulp.dest(rootPath + stylesFolderName))

    .on('end', function() {
        gutil.log("Finished '" + gutil.colors.cyan("sassCompile") + "' after " + gutil.colors.magenta(((Date.now() - start) + " ms")));
    });
};





// Minify CSS

const cssMinify = function (src) {
    const start = Date.now();
    const filename = src.replace(/^.*[\\\/]/, '');
    gutil.log("Starting '" + gutil.colors.green("cssMinify") + "'... " + gutil.colors.bgCyan(" " + filename + " "));

    return gulp.src(src)
        .pipe(cleanCSS({
            keepBreaks: false
        }))
        .on('error', onError)
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(rootPath + stylesFolderName))
        .pipe(gzip())
        .pipe(gulp.dest(rootPath + stylesFolderName))

    .on('end', function() {
        gutil.log("Finished '" + gutil.colors.green("cssMinify") + "' after " + gutil.colors.magenta(((Date.now() - start) + " ms")));
    });
};





/*  Concatenate Css files  */

gulp.task('concatCSS', function() {
    return gulp.src(cssMainFilesSrc)
        .pipe(concat(cssFileName))
        .pipe(gulp.dest(stylesFolderName));
});




const convertPug2Html = function() {
    return gulp.src(rootPath + 'src/*.pug')
        .pipe(pug({
            basedir: './',
            pretty: true,
            data: {
                environment: 'production',
                assetsDir: 'assets/'
            }
        }))
        .pipe(gulp.dest(buildPath)); // указываем gulp куда положить скомпилированные HTML файлы
};


// Optimizing Images


const imageOptimize = function (src) {
    const start = Date.now();
    gutil.log("Starting '" + gutil.colors.green("imageOptimize") + "'...");

    return gulp.src(src, { base: rootPath + 'src/images' })
        .pipe(imagemin({ progressive: true }))
        .on('error', onError)
        .pipe(gulp.dest(imagesDistFolder))

    .on('end', function() {
        gutil.log("Finished '" + gutil.colors.green("imageOptimize") + "' after " + gutil.colors.magenta(((Date.now() - start) + " ms")));
    });
};

gulp.task('images-optimize-all', function() {
    imageOptimize(imageFilesSrc);
});




/* Generate PNG sprite */

gulp.task('sprite', function () {
    // Generate our spritesheet
    const spriteData = gulp.src(rootPath + 'src/images/4sprite/*.+(png|jpg|jpeg|gif|svg)').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.css',
        cssFormat: 'css',
        imgPath: rootPath + '../images/sprite.png',
        padding: 3,
        cssVarMap: function (sprite) {
            //sprite.name = 'sprite_' + sprite.name + '()';
            sprite.name = sprite.name.split("_").join("-");
            sprite.name = 'icon-spr-' + sprite.name + '()';
        },
        cssOpts: { cssSelector: function (sprite) { return '.' + sprite.name; } }
    }));

    // Pipe image stream through image optimizer and onto disk
    const imgStream = spriteData.img
        .on('error', onError)
        .pipe(gulp.dest(rootPath + 'src/images/'));

    // Pipe CSS stream through CSS optimizer and onto disk
    const cssStream = spriteData.css
        .on('error', onError)
        .pipe(gulp.dest(rootPath + sassFolderName + '/'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});





/* Generate SVG sprite */

const svgSpriteBasicConfig = {
    dest: '',
    shape: {
        dimension: {
            maxWidth: 64,
            maxHeight: 64,
            precision: 2,
            attributes: true
        },
        spacing: {
            padding: 0
        },
        transform: ['']
    },
    svg: {
        dimensionAttributes: false,
        namespaceClassnames: false
        //xmlDeclaration: false,
    }
};

const svgCssSpriteConfig = {
    svgSpriteBasicConfig,
    mode: {
        css: {
            bust: false,
            dest: '',
            dimensions: '.',
            prefix: '',
            render: {
                scss: {
                    dest: sassFolderName + '/_svg-css-sprite.scss'
                }
            },
            sprite: imagesDistFolder + 'sprite.css.svg'
        }
    }
};

const svgInlineSpriteConfig = {
    svgSpriteBasicConfig,
    mode: {
        symbol: {
            dest: '',
            render: {
                scss: {
                    dest: sassFolderName + '/_svg-symbol-sprite.scss'
                }
            },
            sprite: imagesDistFolder + 'sprite.symbol.svg'
        },
        stack: {
            dest: '',
            /*
            */
            render: {
                scss: {
                    dest: sassFolderName + '/_svg-stack-sprite.scss'
                }
            },
            sprite: imagesDistFolder + 'sprite.stack.svg'
        }
    }
};


function svgInlineSprite() {
    return gulp.src(svgInlineSpriteIconsSrc, { cwd: '' })
        .pipe(svgSprite(svgInlineSpriteConfig))
        .on('error', onError)
        .pipe(gulp.dest(rootPath + ''));
}


function svgCssSprite() {
    return gulp.src(svgCssSpriteIconsSrc, { cwd: '' })
        .pipe(svgSprite(svgCssSpriteConfig))
        .on('error', onError)
        .pipe(gulp.dest(rootPath + ''));
}





/* Error Reader */
function onError(err) {
    gutil.log(err);
    this.emit('end');
}




function runWebpack() {
    webpack(webpackConfig, function(err, stats) {
        if (err) console.log('Webpack', err);
        console.log(stats.toString({
            colors: true,
            errorDetails: true,
            modules: true,
            reasons: true
        }));
    });

    // OR

    // what difference ?
    /*return new Promise(resolve => webpack(webpackConfig, (err, stats) => {
        if (err) console.log('Webpack', err);

        console.log(stats.toString({
            colors: true,
            errorDetails: true,
            modules: true,
            reasons: true
        }));
        resolve();
    }));*/
}

function devWatch() {
    gulp.watch(rootPath + sassFolderName + '/**/*.scss').on("change", function(path) {
        sassCompile(rootPath + sassFolderName + '/main.scss');
    });

    gulp.watch(rootPath + 'src/components/**/*.scss').on("change", function(path) {
        sassCompile(rootPath + sassFolderName + '/main.scss');
    });

    gulp.watch(rootPath + 'src/images/4sprite/**/*.+(png|jpg|jpeg|gif|svg)', gulp.series('sprite'));
    // gulp.watch(svgSpriteIconsSrc, gulp.series('svgSprite'));
    gulp.watch(svgCssSpriteIconsSrc, gulp.series(svgCssSprite));
    gulp.watch(svgInlineSpriteIconsSrc, gulp.series(svgInlineSprite));
    gulp.watch(imageFilesSrc).on("change", function(path) {
        imageOptimize(path);
    });
}

function devScripts() {
    return new Promise(function(resolve, reject) {
        webpackConfig.mode = 'development';
        webpackConfig.watch = true;
        webpackConfig.devtool = 'source-map'; // any "source-map"-like devtool is possible
        webpackConfig.output.filename = 'main.dev.js';
        runWebpack();

        devWatch();

        startServer();

        resolve();
    });
}

function devOptimizedScripts() {
}

function buildScripts() {
    return new Promise(function(resolve, reject) {
        webpackConfig.mode = 'production';
        webpackConfig.output.filename = 'main.js';
        webpackConfig.plugins = [
            new UglifyJSPlugin({
                uglifyOptions: {
                    output: {
                        comments: false,
                        beautify: false
                    }
                }
            })
        ];
        runWebpack();

        sassCompile(rootPath + sassFolderName + '/main.scss');
        // gulp.series('sass-compile-main', 'concatCSS');
        cssMinify(rootPath + stylesFolderName + "/" + cssFileName);

        resolve();
    });
}



export const dev = gulp.series( devScripts );
export const generateHtml = gulp.series( convertPug2Html );
export const build = gulp.series( buildScripts );

export default dev;