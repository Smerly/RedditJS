require('dotenv').config();
// Other import things
const express = require('express');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuth);
app.use(express.static('public'));

const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const {
	allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');

// Controller import things

require('./controllers/posts')(app);
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);
require('./data/reddit-db');

app.engine(
	'handlebars',
	exphbs.engine({
		defaultLayout: 'main',
		handlebars: allowInsecurePrototypeAccess(Handlebars),
	})
);
// Use handlebars
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
	res.render('home', { msg: 'Handlebars are Cool!' });
});

// Start up stuffs

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log('App listening on port 3000!');
});

module.exports = app;
