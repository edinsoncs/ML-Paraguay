var express = require('express');
var router = express.Router();

var dateFormat = require('dateformat');

var now = new Date();

var fs = require('fs');

var path = require('path');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.post('/', multipartMiddleware, function(req, res, next) {

	var archivo = req.files.archivo;
	//console.log(archivo)

	var ubicacionArchivo = req.files.archivo.path;

	console.log(ubicacionArchivo);

	var db = req.db;
	var collection = db.get('files');	

	fs.readFile(ubicacionArchivo, function(err, File) {

		if(err) {
			return err
		}
		else {

			var nameFile = req.files.archivo.name;
			var directorySave = path.join(__dirname, '..', 'public', 'files/' + nameFile);
			var urlFile = 'files/' + nameFile;

			fs.writeFile(directorySave, File, function(err){
				if(err) {
					return err
				}
			
				else {
					collection.insert({
						'nombreFile': nameFile,
						'urlFile': urlFile,
						'fechaFile': dateFormat(now, "dddd, mmmm dS, yyyy"),
						'fecha': req.body.fecha
					}).success(function(data){
						res.redirect('listado');
					}).error(function(err){
						console.log('orale wey hubo error ' + err);
					});
				}
			});


		}


	});


});


module.exports = router;