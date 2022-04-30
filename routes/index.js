const router = require('express').Router();
const passport = require('passport');
const models = require('../models');
const isAuthenticated = require('./authMiddleware').isAuthenticated;

// router.get('/', (req, res, next) => {
//     res.sendFile('welcome')
// });

router.get('/login', (req, res, next) => {
    res.sendFile('/views/login.html', { root: './'})
});

router.get('/register', (req, res, next) => {
    res.sendFile('/views/register.html', { root: './'})
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', isAuthenticated, (req, res, next) => {
    res.sendFile('/views/profile.html', { root: './'})
});

router.get('/aboutUs', (req, res, next) => {
    res.sendFile('/views/about-us.html', { root: './'})
});

//post

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/profile'
}));

router.post('/register', (req, res, next) => {
    console.log(req.body.username, req.body.password);
    models.register(req.body.username, req.body.password)
    .then((response) => {
        if (response.error === 'User already exists') {
            res.send(response.error);
        } else {
            res.redirect('/login')
        }
    })
    .catch(err => {
        res.send(err)
    })
});



module.exports = router;