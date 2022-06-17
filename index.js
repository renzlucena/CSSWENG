const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/assignment-db')

const express = require('express')
const app = new express()

const viewAssignment = require('./database/models/viewAssignment')

app.use(express.json())
app.use(express.urlencoded ({extended:true}))

app.get('/', function(req,res) {
	res.sendFile(__dirname + '\\' + 'viewAssignment.html');
});

app.post('/submit-post', function(req,res){
	viewAssignment.create(req.body, (error,post) =>
	{
        res.redirect('/')
	})
})

var server = app.listen(3000,function(){
	console.log ('Node server is running...')
});