const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

const readJson = fs.readFileSync('./data/cars.json');
let car = JSON.parse(readJson); 

app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/'));
app.get('/', (req, res) => {
	let filterData = [];  



	res.render('index', { car });
});


// add car
app.get('/add', (req, res) => {
	res.render('add');
});  

app.post('/add', (req, res) => {
	const { imsr, name,local,price} = req.body;
 
	car.push({ ID: car.length+1, imsr: imsr, name:name,local:local,price:price });
	fs.writeFileSync('./data/cars.json', JSON.stringify(car, null, 4));
	res.redirect('/'); 
});


app.get('/edit/:id', (req, res) => {
	const { id } = req.params;
	let carId;

	for (let i = 0; i < car.length; i++) {
		if (Number(id) === car[i].ID) {
			carId = i;
		}
	}

	res.render('edit', { car: car[carId] });
});

app.post('/edit/:id', (req, res) => {
	const { id } = req.params;
	const {imsr, name, local,price } = req.body;

	let carId;
	for (let i = 0; i < car.length; i++) {
		if (Number(id) === car[i].ID) {
			carId = i;
		}
	}

	car[carId].imsr = imsr;
	car[carId].name = name;
	car[carId].local = local;
	car[carId].price = price;
	 

	fs.writeFileSync('./data/cars.json', JSON.stringify(car, null, 4));
	res.redirect('/');  
});

app.get('/delete/:id', (req, res) => {
	const { id } = req.params;
 
	const newData = [];
	for (let i = 0; i < car.length; i++) {
		if (Number(id) !== car[i].ID) {
			newData.push(car[i]);
		}
	}

	car = newData;
	fs.writeFileSync('./data/cars.json', JSON.stringify(car, null, 4));
	res.redirect('/');
});

app.listen(port, () => console.log(`our pro listening on port ${port}!`));
