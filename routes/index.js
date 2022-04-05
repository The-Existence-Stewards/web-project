let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    // Issue with path
    res.sendFile(__dirname + '/views/index.html');
});

module.exports = router;