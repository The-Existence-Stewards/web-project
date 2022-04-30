const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models/index');

const customFields = {
    usernameField: 'username',
    passwordField: 'password'
};

const verifyCallback = (username, password, done) => {
    models.login(username, password)
    .then((response) => {
        if (response.error) {
            return done(null, false, { message: response.error });
        } else {
            return done(null, response);
        }
    })
    .catch(err => {
        return done(err);
    })
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
    models.getUser(id)
    .then(user => {
        done(null, user);
    })
    .catch(err => {
        done(err);
    });
});