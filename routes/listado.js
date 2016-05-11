var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	//var nameUser = req.user.username;
	
	var db = req.db;
	var dataFiles = db.get('files');


	dataFiles.find({}, function(err, doc){
		if(err) {
			return err;
		}
		else {

			var inDoc = doc.reverse();

			res.render('listado', {
				title: 'Panel MilleniaCapital',
				files: inDoc
			});	
		}
	});

});


module.exports = router;