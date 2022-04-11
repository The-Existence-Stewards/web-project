let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    // Issue with path
    res.sendFile('C:/Users/Onion/Desktop/Test/web-project/views/index.html');
});

module.exports = router;