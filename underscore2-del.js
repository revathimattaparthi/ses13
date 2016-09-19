var express = require('express');
var bodyParser = require('body-parser');
var _= require('underscore');

var app = express();
var PORT = process.env.PORT || 8080;
var todoNextId = 1;
todos =[];

 app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// get/todos
app.get('/todos', function(req, res){
	res.json(todos);
});

// get/todo/:id

app.get('/todos/:id', function(req, res){

	var todoId = req.params.id;
	var matchedobj = _.findwhere(todos,{id: todoID});

	 if(matchedobj){
	 	res.json(matchedobj);
	 } else {
	 	res.status(404).send();
	 }
});

// POST todos
app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		
		return res.status(400).send();
	 
	 }

	 body.description = body.description.trim();
	 body.id = todoNextId++;
	todos.push(body);
	res.json(body);


});


// Delete /todos/:id

app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});
	if(!matchedTodo) {
		res.status(404).json({"error":"no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	}
});

app.listen(PORT, function(){
	console.log(' Express Listening on port ' + PORT + '!!');
});