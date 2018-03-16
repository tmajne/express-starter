require('dotenv').config();

let express = require('express');

let bodyParser = require('body-parser');
let compression = require('compression');
let cookieParser = require('cookie-parser');
let cookieSession = require('cookie-session');
let debug = require('debug')('http');
//let favicon = require('serve-favicon');
let helmet = require('helmet');
let logger = require('morgan');
let path = require('path');
let sassMiddleware = require('node-sass-middleware');

let index = require('./controllers/index');
let users = require('./controllers/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression(
    {
        filter: (req, res) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            debug('booting %o', 'aaa');
            return compression.filter(req, res);
        }
    }
));
app.use(cookieSession(
    {
        name: 'session',
        keys: ['tom', 'bar'],

        // Cookie options
        maxAge: 86400000,    // 24 hours
        cookie: {
            secure: true,
            httpOnly: true,
            //domain: 'xxx.com',
            //path: 'xxx/www',
            //expires: new Date(Date.now() + 60 * 60 * 1000)
        }
    }
));
app.use(helmet());

app.use("/", index);
app.use("/users", users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
