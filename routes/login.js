const express = require('express');
const router = express.Router();
const login = require('../models/login_model');

router.get('/', (req, res) => {
    res.sendFile('/public/login.html', { root: "./"});
});

router.post('/', (req, res) => {
    console.log('req.body: ', req.body.username);
    login.login(req.body.username, req.body.password)
        .then(result => {
            if (result.error) {
                res.json({ error: result.error });
            } else {
                res.json(result);
            }
        })
});

module.exports = router;