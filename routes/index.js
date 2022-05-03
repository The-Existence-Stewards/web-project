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

router.get('/howItWorks', (req, res, next) => {
    res.sendFile('/views/how-it-works.html', { root: './'})
});

router.get('/faq', (req, res, next) => {
    res.sendFile('/views/faq.html', { root: './'})
});

router.get('/skills', (req, res, next) => {
    // console.log(models.getSkills(req.user.user_id)) ;
    models.getSkills(req.user.user_id).then(result => res.send(result));
});

router.get('/username', (req, res, next) => {
    models.getUser(req.user.user_id).then(result => res.send(result.username));
})

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

// put

router.put('/addMinutes' , (req, res, next) => {
    models.updateStats(req.body.min, req.body.skillName, req.user.user_id)
    .then((response) => { res.send(response) });
    // receive minutes, (user_id/skill_id), skillName, calculatedXp, currentXp, currentLVL, xpForLvlUp
    // check for limit
        // if good calculate new values and send success back
        // if bad send back failure
});

// delete

router.delete('/deleteAccount', )

module.exports = router;