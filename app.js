let express = require('express');
let path = require('path');
// let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let flash = require('connect-flash');
let index = require('./routes/index');
let users = require('./routes/users');
let validator = require('express-validator');

let signup = require('./controllers/auth.controller');
// let paymentController = require('./controllers/payment.controller');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
const passport = require("passport");

let devEnv = require('./configs/dev.env.config');
let subdomain = require('express-subdomain');
// let subdomainController = require('./controllers/subdomain.controller');
let preRenderer = require('prerender-node').set('prerenderToken', '4HoweJhX4zZO3jnY4fzV');

let transactionsController = require('./controllers/transaction.controller');

let app = express();
app.use(cookieParser());


if(devEnv){
    console.log('DEVELOPMENT ENVIRONMENT for app');
    app.use(session({
        store: new MongoStore({
            url: 'mongodb://localhost:27017/spave',
            autoRemove: 'interval',
            autoRemoveInterval: 1 // In minutes. Default
        }),
        secret: 'cxq-mmlc-ddfe',
        resave: false,
        saveUninitialized: true
    }));
}
else {
    console.log('PRODUCTION ENVIRONMENT for app');
    app.use(session({
        store: new MongoStore({
            url: 'mongodb://hashcode:lekkysonra@ds235388.mlab.com:35388/etickett',
            autoRemove: 'interval',
            autoRemoveInterval: 1 // In minutes. Default
        }),
        secret: 'volq-fsbgj-sxga',
        resave: false,
        saveUninitialized: true
    }));
}

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'etickett','images', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'etickett')));

// app.use(subdomain('*', subdomainController));

app.use('/api', index);
app.use('/api/users', users);

app.use('/api/auth', signup);
app.use('/api/transactions', transactionsController);
app.use(preRenderer);


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
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
    }
    res.status(err.status || 500);
    res.redirect('/error');
});

app.listen(5000, ()=> { console.log("Listening on port 5000")});
module.exports = app;
