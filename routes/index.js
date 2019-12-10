'use strict';
var express = require('express');
var router = express.Router();
var makemodel_controller = require('../controllers/makeModelController');
const makemodels = require('../public/json/makemodels.json')

// POST request for creating search request.
router.post('/', makemodel_controller.search);

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Auto POC',
        searchresults: [],
        medianresults: [],
        makemodels: makemodels });
});

module.exports = router;
