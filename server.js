//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var mongoose = require("mongoose");
var integerValidator = require("mongoose-integer")
//start app
var app = express();
//use path & body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static')));
// && ejs
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// for promises
mongoose.Promise = global.Promise;
// connect to mongoDB
mongoose.connect('mongodb://localhost/mongoose_dashboard');
// create schema for new entries
var SnekSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 2, maxlength: 256},
	speed: {type: Number, integer: true, minvalue: 1, maxvalue: 10}
	}, 
	{timestamps: true});
var Snek = mongoose.model('Snek', SnekSchema.plugin(integerValidator));

//routes
//Get all sneks
app.get('/', function(req, res) {
    Snek.find({}).sort('-name')
    .exec(function(err, sneks){
        res.render('sneks', {sneks: sneks});
    });
});

// New Snek form 
app.get('/sneks/new', function(req, res) {
	res.render('new');
});

// Add new snek
app.post('/sneks', function(req, res) {
	console.log("POST DATA", req.body);
	var snek = new Snek({name: req.body.name, speed: req.body.speed});
	snek.save(function(err) {
		if (err) {
			res.render('index',  {errors: snek.errors});
		} else {
			res.redirect('/')
		}
	});
});

// Show one snek
app.get('/:id', function(req, res){
  Snek.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('snek', { snek: response[0] });
  });
});

// Edit path
app.get('/:id/edit/', function(req, res){
  Snek.find({ _id: req.params.id }, function(err, response) {
    if (err) { console.log(err); }
    res.render('edit', { snek: response[0] });
  })
});

// Update
app.post('/:id', function(req, res) {
	Snek.update({ _id: req.params.id }, req.body, function(err, result) {
		if (err) { console.log(err); }
		res.redirect('/');
	});
});

// Delete
app.post('/:id/delete', function(req, res) {
	Snek.remove({ _id: req.params.id }, function(err, result) {
		if (err) { console.log(err); }
		res.redirect('/');
	});
});

//listen
app.listen(8000, function() {
	console.log('listening on port 8000, like a bossss');
});
