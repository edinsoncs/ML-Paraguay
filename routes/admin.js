var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	var nameUser = req.user.username;
	
	var db = req.db;
	var dataFiles = db.get('files');


	dataFiles.find({}, function(err, doc){
		if(err) {
			return err;
		}
		else {

			var inDoc = doc.reverse();

			res.render('admin', {
				title: 'Panel MilleniaCapital',
				name: nameUser,
				files: inDoc
			});	
		}
	});


});

router.get('/borrar/:id', function(req, res, next) {

	var id = req.params.id;

	var db = req.db;

	var collection = db.get('files');

	collection.findOne({'_id': id}, function(err, doc){

		if(err) {
			console.log('error ' + err);
		}
		else {
			collection.remove({'_id': id}, function(err, doc){
				if(err) {
					console.log('no se removio ' + err);
				}
				else {
					console.log('funciono!!!');
				}
			}).success(function(data){
				console.log('se removio')
			}).error(function(err){
				console.log('hubo un error' + err);
			})

			res.render('success', {
				title: 'Archivo borrado',
				name: req.user.username,
				dataSuccess: 'Se borro correctamente'
			});

			
		}

	});


});

module.exports = router;