var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){

	var nameUser = req.user.username;

	res.render('panel', {
		title: 'Panel MilleniaCapital',
		name: nameUser
	});


});


module.exports = router;