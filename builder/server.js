const express = require("express");
const app     = express();
const fs      = require("fs");

// import bodyParser from 'body-parser';

// app.use( bodyParser.json() ); // support json encoded bodies
// app.use( bodyParser.urlencoded({ extended: true }) ); // support encoded bodies

const multer = require("multer");
let upload = multer();

// const port = process.env.PORT || 8080;


const pagesFolder = "./src/";
const pagesList = [];

// get pages list
fs.readdir(pagesFolder, (err, files) => {
    files.forEach(pageName => {
        if ( pageName.indexOf(".pug") > 0 ) {
            pagesList.push(pageName);
        }
    });
});


export default function startServer() {

    // отключаем кеширования
    app.disable("view cache");

    // указываем какой шаблонизатор использовать
    app.set("view engine", "pug");

    // расположение шаблонов ("templates")
    app.set("views", "./src");

    // app.locals.basedir = "./src/components/";
    app.locals.basedir = "./";

    app.use(function(request, response, next) {
        if (request.url.indexOf(".html") !== -1) {
            const redirectUrl = request.url.replace(".html", "");
            response.redirect(redirectUrl);
        } else {
            next();
        }
    });

    // путь до наших стилей, картинок, скриптов и т.д.
    app.use(express.static("build/assets"));
    app.use(express.static("build/data"));
    app.use(express.static("build/ajax"));
    app.use(express.static("/"));

    app.get('/favicon.ico', (request, response) => response.status(204));

    // роутинг на наши страницы
    // app.get('/*.html*', function(request, response) {

    app.get('/*', function(request, response) {
        // регулярка для получения пути до шаблона
        // const fileName = request.url.replace(/static\/|\..*$/g, '') || 'index';
        const isJson = request.url.indexOf(".json") > 0;

        if (!isJson) {
            const fileName = request.url.replace("/", "") || 'index';

            // response.render(fileName, {
            //     pages: pagesList,
            //     environment: "production",
            //     assetsDir: "./"
            // });

            response.render(fileName, {
                environment: "production",
                assetsDir: "./"
            }, function(err, html) {
                if (err) {
                    // render error handler
                    response.status(404).render("404", {
                        environment: "production",
                        assetsDir: "./",
                        renderError: err
                    });
                } else {
                    response.send(html);
                }
            });
        }
    });

    // редирект на главную страницу
    app.get('/', function(request, response) {
        response.redirect('/index');
    });
    app.get('', function(request, response) {
        response.redirect('/index');
    });

    app.post('/recover', upload.fields([]), (request, response) => {
        const formData = request.body;
        const email = formData["input-recovery-email"];

        response.send({
            email: email
        });
    });

    app.post('/data/*', function(request, response) {
        const redirectUrl = request.url.replace("/data", "");
        response.redirect(redirectUrl);
    });

    // app.post('/data/cart.json', function(request, response) {
    //     // const formData = request.body;
    //     // const isAjax = formData["ajax"];

    //     // if (isAjax == "Y") {
    //     //     response.send({
    //     //     });
    //     // }

    //     response.sendFile('data/cart.json');
    // });

    // 404 error handler
    app.use(function (request, response, next) {
        response.status(404).render("404", {
            environment: "production",
            assetsDir: "./"
        });
    });

    const listener    = app.listen();
    const port        = listener.address().port;
    const browserSync = require('browser-sync').create();

    // proxy на локальный сервер на Express
    browserSync.init({
        proxy: 'http://localhost:' + port,
        // startPath: '/static/',
        notify: false,
        tunnel: false,
        host: 'localhost',
        port: port,
        logPrefix: 'Proxy to localhost:' + port,
    });

    // обновляем страницу, если обновились assets файлы
    // browserSync.watch('./public/assets/**/*').on('change', browserSync.reload);

    // обновляем страницу, если был изменен исходник шаблона
    browserSync.watch('./src/components/**/*').on('change', browserSync.reload);
}