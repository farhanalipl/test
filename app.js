var express = require('express');
var expressLayouts = require('express-ejs-layouts');

var https = require('https');
var http = require('http');

var d = require('domain').create();
d.on('error', function (err) {
    // handle the error safely
    console.log(err);
});

d.run(function () {

    var app = express();
    var currentEnvironment = process.env.PROJECT_ENV || 'development';
    app.configure(function () {
        app.use(express.cookieParser());
        app.use(express.session({
            secret: '1234567890QWERTY'
        }));
    });
    app.use(express.methodOverride());
    app.use(express.multipart());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(require("connect-assets")({
        build: true,
        compress: true,
        gzip: true,
        servePath: 'public',
        paths: ["public/js", "public/css"]
    }));

    app.engine('html', require('ejs').renderFile);
    app.use(expressLayouts);
    app.set('view engine', 'ejs');


    function verifySession(req, res, next) {
        app.locals.userLoggedIN = false
        if (req.session.zendeskToken) {
            app.locals.userLoggedIN = true
        }
        next();
    }

    app.get("/", verifySession, function (req, res) {
        var params = {screen_name: 'MassiveBio', count: 4, exclude_replies: true};
        res.send("alert")
    })

    var httpServer = http.createServer(app);
    httpServer.listen(8080);

});
