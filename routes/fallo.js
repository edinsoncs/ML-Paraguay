var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

	res.render('fallo', {
		title: 'Fallo cuenta invalida'
	});

});
module.exports = router;