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
		const account = await Account.findOne({username: req.query.username}).exec();
        
        //if null, username does not exist. Cannot log in
        console.log(req.query.password + " ==? " + account.password)
        console.log(req.query.username + " ==? " + account.username)
		console.log(account)    //why doesnt it retrieve the data????
        
        //if (account==null){
		if (account==null){
            console.log("Account does not exist.")
        //	res.redirect('/login-fail-not-exist.html');
		}
		else if(req.query.username==account.username){
            //checker
            
            
            //found the accoount, load all data
			if(req.query.password == account.password)
			{
                console.log(account)
				//keep session
				sess =req.session;
				sess.username = req.query.username;
				sess.username = req.query.password;
                /*
				sess.username = account.username;
				sess.password = account.password;
				sess.email = account.email;                
                sess.fname = account.fname;
                sess.lname = account.lName;
                sess.appNum = account.appNum;
                sess.appExp = account.appExp;
				*/
				// RENDER DASHBOARD/LANDING PAGE THEN GO TO IT
	//			res.render('dashboard.hbs', {
	//				username: account.username,
	//				remember: account.remember,
    //                email   : account.email,
   //                 fname   : account.fname,
  //                  lName   : account.lName,
 //                   appNum  : account.appNum,
                    //this is like in java: this.data = data
//				})
				res.redirect('/dashboard');
			}
			else
			{
				console.log("Password incorrect! Pass:" + account.password)
				res.redirect('/login-fail-not-exist.html');
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

app.post('/submit-post', function(req,res){
	viewAssignment.create(req.body, (error,post) =>
	{
        res.redirect('/')
	})
})

var server = app.listen(3000,function(){ 
});