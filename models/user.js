var Schema = mongoose.Schema;

var UserDetail = new Schema({
	username: String,
	password: String
}, {
	collection: 'usuarios'
});


var UserDetails = mongoose.model('usuarios', UserDetail);