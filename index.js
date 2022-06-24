const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/appraisers-db')

const express = require('express')
const app = new express()
//for session
const session = require('express-session');

//schemas
const Assignment = require('./database/models/assignment')
const Account = require('./database/models/account')

app.use(express.json())

//so you can see stuff on the url
app.use(express.urlencoded ({extended:true}))

app.get('/', function(req,res) {
	res.sendFile(__dirname + '\\' + 'login.html');
//	res.sendFile(__dirname + '\\' + 'viewAssignment.html');
});

// hbs for template chuchu
var hbs = require('hbs')
app.set('view engine','hbs')

// css stuff and other stuff
app.use(express.static(__dirname + '/'));

// for session
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


app.get('/login', async(req,res)=> {
	try{
        //see if such an account matches someone in the "Account" db (capital)
		const acct = await Account.findOne({username: req.query.username}).exec();

        //if null, username does not exist. Cannot log in
		//the following will throw cannot read property null if no doc exists in db
        console.log(req.query.password) //+ " ==? " + account.password)
        console.log(req.query.username) //+ " ==? " + account.username)
		console.log(acct)    //why doesnt it retrieve the data????

        //if (account==null){
		if (acct==null){
            console.log("Account does not exist.")
        	res.redirect('/login-fail-not-exist.html');
			// will just show a red text to let you know your acct details were wrong or does not match anyone
		}
		else if(req.query.username==acct.username){
            //found the accoount
			//check password if same, if same copy all to session
			if(req.query.password == acct.password)
			{
//                console.log(acct)
				sess = req.session;
				sess.username = req.query.username;
				sess.username = req.query.password;
				sess.acct_id = acct.acct_id;
				sess.email = acct.email;
                sess.fname = acct.fname;
                sess.lname = acct.lname;
                sess.appNum = acct.appNum;
                sess.appexp = acct.appexp;
				// RENDER DASHBOARD
				res.render('dashboard.hbs', {
					username: acct.username,
					remember: acct.remember,
					email   : acct.email,
					fname   : acct.fname,
					lName   : acct.lName,
					appNum  : acct.appNum,
                    //this is like in java: this.data = data
				})
			}
			else
			{
				console.log("Password incorrect! Pass:" + acct.password)
				res.redirect('/login-fail-not-exist.html');
				// will just show a red text to let you know your acct details were wrong
			}
		}
	}
	catch(err){
		console.log(err)
	}
});


app.get('/dashboard', (req,res)=> {
	sess = req.session;
	if(sess.username){ //username exists
		res.render('dashboard.hbs', {
//			username: sess.username,
            username: sess.username,
            remember: sess.remember,
			acct_id: sess.acct_id,
            email   : sess.email,
            fname   : sess.fname,
            lname   : sess.lname,
            appNum  : sess.appNum,
        })
	}
	else{
		res.redirect('/login-fail.html')
		//res.redirect('/submit-login')
		//if you're trying to access the profile page but you're not logged in
	}
});


app.get('/settings', (req,res)=> {
	sess = req.session;
	if(sess.username){
		res.render('settings.hbs', {
            username: sess.username,
            remember: sess.remember,
			acct_id: sess.acct_id,
            email   : sess.email,
            fname   : sess.fname,
            lname   : sess.lname,
            appNum  : sess.appNum,
        })
	}
	else{
		res.redirect('/login-fail.html')
		//if you're trying to access the profile page but you're not logged in
	}
});


app.get('/assignments', (req,res)=> {
	sess = req.session;
	if(sess.username){
		res.render('settings.hbs', {
            username: sess.username,
            remember: sess.remember,
			acct_id: sess.acct_id,
            email   : sess.email,
            fname   : sess.fname,
            lname   : sess.lname,
            appNum  : sess.appNum,
        })
	}
	else{
		res.redirect('/login-fail.html')
		//if you're trying to access the profile page but you're not logged in
	}
});

app.get('/profile', (req,res)=> {
	sess = req.session;
	if(sess.username){
		res.render('profile.hbs', {
            username: sess.username,
            remember: sess.remember,
			acct_id: sess.acct_id,
            email   : sess.email,
            fname   : sess.fname,
            lname   : sess.lname,
            appNum  : sess.appNum,
        })
	}
	else{
		res.redirect('/login-fail.html')
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
