const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/assignment-db')

const express = require('express')
const app = new express()
//for session
const session = require('express-session');


const viewAssignment = require('./database/models/assignment')
const account = require('./database/models/account')

app.use(express.json())
app.use(express.urlencoded ({extended:true}))

app.get('/', function(req,res) {
	res.sendFile(__dirname + '\\' + 'viewAssignment.html');
});

// css stuff and other stuff
app.use(express.static(__dirname + '/'));

// user session

//for session
app.use(session({
	secret: 'hatdog',
	resave: true,
	saveUninitialized: true
}));

var sess;

// destroy session at log out
app.get('/logout',(req,res)=> {
	req.session.destroy((err)=> {
		if(err){
			return console.log(err);
		}
	});
})


app.get('/submit-login', async(req,res)=> {
	
	try{
		const profile = await Profile.findOne({username: req.query.username}).exec();

	//if null, user does not exist. Cannot log in
		console.log(profile)
		
		if (profile==null){
			console.log("Username not registered!")
			res.redirect('/login-fail.html');
		}
		else{
			if(req.query.password == profile.password)
			{
				//keep session
				sess=req.session;
				sess.username = req.query.username;
				sess.password = req.query.password;
				sess.bio = req.query.bio;
				
				// RENDER PROFILE PAGE
				res.render('profile.hbs', {
					username: profile.username,
					password: profile.password,
					remember: profile.remember,
					bio: profile.bio//,
					//bookmarks: profile.bookmarks
					//this is like in java: this.data = data
				})
				res.redirect('/profile');
			}
			else
			{
				console.log("Password incorrect!")
				res.redirect('/login-fail.html');
			}
		}
	}
	catch(err){
		console.log(err)
	}

});

app.get('/profile', (req,res)=> {
	sess = req.session;
	if(sess.username){
			
		res.render('profile.hbs', {
			username: sess.username,
			password: sess.password,
			remember: sess.remember,
			bio: sess.bio//,
			//bookmarks: profile.bookmarks
		})
	}
	else{
		res.redirect('/submit-login')
		//if you're trying to access the profile page but you're not logged in
	}
});


app.post('/submit-post', function(req,res){
	viewAssignment.create(req.body, (error,post) =>
	{
        res.redirect('/')
	})
})

var server = app.listen(3000,function(){ 
});