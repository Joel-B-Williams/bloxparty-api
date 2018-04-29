let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');
let app = express();

const PORT = process.env.PORT || 3001;

let pool = new pg.Pool({
	port: process.env.DB_PORT || 5432,
	password: process.env.DB_PW,
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

app.post('/api/new-playpen', function(req,res) {
	
	var playpen_name = req.body.name;

	pool.connect((err,client,done)=>{
		if(err){
			return res.status(400).send(err);
		} else {
			client.query('INSERT INTO playpens (name) VALUES ($1)',[playpen_name],(err,table)=>{
				if(err){
					return res.status(400).send(err);
				} else {
					res.status(200).send({ message: 'Playpen Initialized' });
				}
			});
		}

	});
})

app.get('/api/playpen/:name', function(req, res) {
	var name = req.params.name;

	pool.connect(function(err, client, done) {
		if(err) {
			return res.status(400).send(err);
		} else {
			client.query('SELECT FROM playpens WHERE name = $1', [name], function(err, table) {
				done();
				if (err) {
					return res.status(400).send(err);
				} else {
					res.status(200).send(table.rows);
				}
			})
		}
	});
})

app.listen(PORT, ()=> console.log('Listening on port ' + PORT));