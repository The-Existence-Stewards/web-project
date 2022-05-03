if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes');
const connection = require('./config/database');
// const expressEjsLayouts = require('express-ejs-layouts');

const app = express();

// app.set('view engine', 'ejs');
// app.use(expressEjsLayouts);

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Postgres = require('connect-pg-simple')(session);

const sessionStore = new Postgres({ pool: connection, tableName: 'session' });

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        // set to expire in one day (ms/s * s/min * min/h * h/day * days)
        maxAge: 1000 * 60 * 60 * 24 * 1
    }
}));

require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());

// For debugging purposes
// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.user);
//     next();
// });

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});