var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var  app1 = express();
var PORT = process.env.PORT || 8080;

var categoryNextId = 1;
categories = [];

app1.get('/', function(req, res) {
	res.send('Category API');
});

app1.use(bodyParser.json());

// To get categories of product

app1.get('/categories', function(req, res) {
	res.json(categories);
});

// To get categories by id

app1.get('/categories/:id', function(req, res){

	var categoryId = parseInt(req.params.id);

	var  matchedCategory = _.findWhere(categories, {id : categoryId});

	if(matchedCategory){
		res.json(matchedCategory);
	} else {
		res.status(404).send();
	}
});

//To POST the category details

app1.post('/categories', function(req, res) {
	var body = _.pick(req.body, 'id','categoryName', 'description');

	if(!_.isString(body.categoryName) || body.categoryName.trim().length === 0 || !_.isString(body.description) || body.description.trim().length === 0 )
		{
			res.status(400).send('Please give the details properly');
		}

	body.description = body.description.trim();
	body.categoryName = body.categoryName.trim();
	body.id = categoryNextId++;
	categories.push(body);
	res.json(body);
});


// Delete /categories using /:id
app1.delete('/categories/:id', function(req,res){
	var categoryId = parseInt(req.params.id);
	var matchedCategory = _.findWhere(categories, {id: categoryId});

	if(!matchedCategory){
		res.status(404).json({"error" : "no categories found "});
	} else {
		categories = _.without(categories, matchedCategory);
		res.json(matchedCategory);
	}
});



//put categories/:id
app1.put('/categories/:id', function(req, res){
	var categoryId = parseInt(req.params.id);
	var matchedCategory = _.findWhere(categories, {id: categoryId});
	
	var body = _.pick(req.body, 'id', 'categoryName', 'description');

	var validAttributes = {};

	if(!matchedCategory) {
		return res.status(404).send('Category id not matched');
	}


	if(body.hasOwnProperty('categoryName') && _.isString(body.categoryName)){
		validAttributes.categoryName = body.categoryName;
	} else if(body.hasOwnProperty('categoryName')){
		return res.status(404).send('error');
	} 

	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;

	} else if(body.hasOwnProperty('description')){
		return res.status(404).send();
	}


	_.extend(matchedCategory,validAttributes);

	res.json(matchedCategory);
});

app1.listen(PORT, function(){
	console.log(' Express Listening on port ' + PORT + '!!');
});
