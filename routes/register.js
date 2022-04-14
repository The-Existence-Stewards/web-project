const express = require('express');
const router = express.Router();
const register = require('../models/register_model');

router.get('/', (req, res) => {
    res.sendFile('/public/register.html', { root: "./"});
});

router.post('/', (req, res) => {
    console.log('req.body: ', req.body.username);
    register.register(req.body.username, req.body.pwd)
        .then(result => {
            if (result.error) {
                res.json({ error: result.error });
            } else {
                res.json(result);
            }
        })
});

module.exports = router;