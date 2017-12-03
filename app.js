const express = require('express'),
    app = express(),
    port = process.env.PORT || 1000;
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const exphbs = require(`express-handlebars`);
const methodOverride = require('method-override');
const flash = require('connect-flash'),
    session = require('express-session');
const bodyParser = require('body-parser');


//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);
//DB connection

const database = require('./config/database');
//map global promise and get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose(install save mongoose to node js module and signp for mlab acct.)
mongoose.connect(database.mongoURI, {
    useMongoClient: true
}).then(() => console.log('MongoDB connected...')).catch(err => console.log(err));



// Register `hbs.engine` with the Express app.

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//handlebars middlewares.
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());




//method override-middleware
app.use(methodOverride('_method'))

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//index route.
app.get('/', (req, res) => {
    const title = 'welcome to home page';
    res.render(`index`, {
        title
    });
});

//About route
app.get('/about', (req, res) => {
    res.render('about');
});

//Mail us route.
app.get('/mail-us', (req, res) => {
    res.render('mail-us');
});




//use routes
app.use('/ideas', ideas);
app.use('/users', users);

// //Static folder

app.use(express.static(__dirname + "/public"));

//Response to non-existing route

app.get('*', function(req, res) {
    res.render('err');
});

app.listen(port, () => {
    console.log(`Your app is running on port ${port}`);
});