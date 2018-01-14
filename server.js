let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');
let app = express();

const PORT = process.env.PORT || 3001;

let pool = new pg.Pool({
	port: process.env.DB_PORT || 5432,
	password: process.env.Db_PW,
	database: process.env.DB,
	user: process.env.DB_USER || 'postgres',
	host: 'localhost',
	max: 10
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.listen(PORT, ()=> console.log('Listening on port ' + PORT));