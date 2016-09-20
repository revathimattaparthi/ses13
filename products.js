var express = require('express');
var bodyParser = require('body-parser');
var _= require('underscore');
var app1 = express();
var PORT = process.env.PORT || 8080;
var productNextId = 1;
products = [];

app1.get('/', function(req,res){
	res.send('Products API');
});

app1.use(bodyParser.json());

//get products

app1.get('/products', function(req, res){
	res.json(products);
});

//get products/:id

app1.get('/products/:id', function(req, res){

	var productId = req.params.id;
	var  matchedProduct = _.findWhere(products, {id : productId});

	if(matchedProduct){
		res.json(matchedProduct);
	} else {
		res.status(404).send();
	}
});


// POST products
app1.post('/products', function(req, res){
	var body = _.pick(req.body,  'productName', 'description','price' , 'quantity', 'categoryId');

	if(!_.isString(body.productName) || body.productName.trim().length === 0 || !_.isString(body.description) || body.description.trim().length === 0 ||
	 body.price.trim().length === 0 || body.quantity.trim().length === 0 ){
	
		return res.status(400).send();
	 
	 }

	 body.description = body.description.trim();
	 body.id = productNextId++;
	products.push(body);
	res.json(body);
});


// Delete /todos/:id

app1.delete('/products/:id', function(req, res){
	var productId = parseInt(req.params.id);
	var matchedProduct = _.findWhere(products, {id: productId});

	if(!matchedProduct) {
		res.status(404).json({"error":"no todo found with that id"});
	} else {
		products = _.without(products, matchedProduct);
		res.json(matchedProduct);
	}
});



//put todos/:id
app1.put('/products/:id', function(req, res){
	var productId = parseInt(req.params.id);
	var matchedProduct = _.findWhere(products, {id: productId});
	var body = _.pick(req.body, 'id', 'productName', 'description','price' , 'quantity', 'categoryId');
	var validAttributes = {};

	if(!matchedProduct) {
		return res.status(400).send();
	}


	if(body.hasOwnProperty('productName') && _.isString(body.productName)){
		validAttributes.productName = body.productName;
	} else if(body.hasOwnProperty('productName')){
		return res.status(400).send();
	} 

	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;

	} else if(body.hasOwnProperty('description')){
		return res.status(400).send();
	}


	if(body.hasOwnProperty('price') && body.price.trim().length > 0){
		validAttributes.price = body.price;
	} else if(body.hasOwnProperty('price')){
		return res.status(400).send();
	} 

	if(body.hasOwnProperty('quantity') && body.quantity.trim().length > 0){
		validAttributes.quantity = body.quantity;
	} else if(body.hasOwnProperty('quantity')){
		return res.status(400).send();
	} 

	if(body.hasOwnProperty('categoryId') && body.categoryId.trim().length > 0){
		validAttributes.categoryId = body.categoryId;
	} else if(body.hasOwnProperty('categoryId')){
		return res.status(400).send();
	} 

	_.extend(matchedProduct,validAttributes);

	res.json(matchedProduct);
});

app1.listen(PORT, function(){
	console.log(' Express Listening on port ' + PORT + '!!');
});