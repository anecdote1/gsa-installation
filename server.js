const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors'); 
const shell = require('shelljs');
const pdf = require('html-pdf');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.post('/print', (req, res) => {

	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	var words = req.body.words;
	var htmlString = '<ul>';
	words.forEach(function(word){
		htmlString += '<li style="font-family: DotMatrix">'+word.word+'</li>';
	});

	htmlString += '</ul>';

	const config = {'width': '80mm'};

	pdf.create(htmlString, config).toFile('bork.pdf', function(err, res){
		shell.exec('lpr bork.pdf');
	});
	res.json({ success: true });
});

app.get('/words', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	

	const words = fs.readFileSync('data/words.json', 'utf8');
	const data = JSON.parse(words);

	res.json(data);
});



app.listen(3000, () => console.log('Example app listening on port 3000!')); 
