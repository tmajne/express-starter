let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    console.log("Running in: "  + process.env.NODE_ENV);
    res.render('index', { title: 'Express' });
});

module.exports = router;
