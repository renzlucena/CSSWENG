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

//moment js https://momentjs.com/docs/
const moment = require('moment');
// const formatTime = moment(dateFromDB).format('mm:dd:yy')
// moment().format();
// hbs.registerHelper('moment', require('helper-moment'));
// hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

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
		res.redirect('/login');
	});
})


app.get('/login', async(req,res)=> {
	try{
        //see if such an account matches someone in the "Account" db (capital)
		const acct = await Account.findOne({username: req.query.username}).exec();

        //if null, username does not exist. Cannot log in
		//the following will throw cannot read property null if no doc exists in db
        // console.log(req.query.password) //+ " ==? " + account.password)
        // console.log(req.query.username) //+ " ==? " + account.username)
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
				sess = req.session,
				sess.username = req.query.username,
				sess.password = req.query.password,
				sess.acct_id = acct.acct_id,
				sess.email = acct.email,
                sess.fname = acct.fname,
                sess.lname = acct.lname,
                sess.appNum = acct.appNum,
                sess.appexp = acct.appexp
				
				if(req.query.username == "admin")
				{
					res.redirect('/assignments');

					// res.render('assignments_admin.hbs', {
						// username: acct.username,
						// remember: acct.remember,
						// password: acct.password,
						// acct_id : acct.acct_id,
						// email   : acct.email,
						// fname   : acct.fname,
						// lName   : acct.lName,
						// appNum  : acct.appNum,
						// appexp : acct.appexp
						// //this is like in java: this.data = data
				}
				
				// RENDER DASHBOARD
				res.render('dashboard.hbs', {
					username: acct.username,
					remember: acct.remember,
					password: acct.password,
					acct_id : acct.acct_id,
					email   : acct.email,
					fname   : acct.fname,
					lName   : acct.lName,
					appNum  : acct.appNum,
					appexp : acct.appexp
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


app.get('/history', async(req,res)=>{

	sess = req.session
	if(sess.username)
	{
		if(sess.username == "admin")
		{	//show all if admin
			const ass = await Assignment.find({})
			res.render('history_admin.hbs', {
				assignment : ass,
				username: sess.username,
				remember: sess.remember,
				password: sess.password,
				acct_id : sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lName   : sess.lName,
				appNum  : sess.appNum,
				appExp : sess.appExp
			});
			console.log(ass)
		}
		else// if (sess.username != "admin")
		{
			const ass = await Assignment.find({
				assigned_to: sess.username,
				comment: "Approved."})
			
			res.render('history.hbs', {
				assignment : ass,
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
			});
		}
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});

//TODO!
app.get('/admin-process', async(req,res)=>{
	
})
//TODO
app.get('/viewAssignment/:ref_id', async(req,res)=>{
	sess = req.session
	// console.log(req)
	var id = req.params.ref_id
	if(sess.username)
	{
		
		if(sess.username == "admin")
		{	//if admin, cannot edit, but can comment
			const ass = await Assignment.find({
				ref_id : id
				}).exec()
				
			res.render('viewAssignment_admin.hbs', {
				assignment : ass,
				username: sess.username,
				remember: sess.remember,
				password: sess.password,
				acct_id : sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lName   : sess.lName,
				appNum  : sess.appNum,
				appExp : sess.appExp
			});
		}
		else// if (sess.username != "admin")
		{
			const ass = await Assignment.find({
				assigned_to: sess.username,
				ref_id: id}).exec()
			
			res.render('viewAssignment.hbs', {
				assignment : ass,
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
		});
		}
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});


app.get('/dashboard', (req,
res)=> {
	sess = req.session;
	if(sess.username){ //username exists
		res.render('dashboard.hbs', {
            username: sess.username,
			password: sess.password,
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

//TODO make this functional, as in working if you click save
//  check if there are changes and save only the ones that are not blank
app.get('/settings', (req,res)=> {
	sess = req.session;
	if(sess.username){
		res.render('settings.hbs', {
            username: sess.username,
			password: sess.password,
            remember: sess.remember,
			acct_id: sess.acct_id,
            email   : sess.email,
            fname   : sess.fname,
            lname   : sess.lname,
            appNum  : sess.appNum
        })
	}
	else{
		res.redirect('/login-fail.html')
		//if you're trying to access the profile page but you're not logged in
	}
});


app.get('/set-settings', async(req,res)=> {
	sess = req.session;
	if(sess.username){
		//update db
		try{
			//render with new data
			if (req.query.username!= sess.username && req.query.username != "")
			{	
				await Profile.findOneAndUpdate({username: sess.username},{username: req.query.username})
				sess.username = req.query.username
			}
			
			await Profile.findOneAndUpdate({username: sess.username},{bio: req.query.bio})
			sess.bio = req.query.bio;
			
			if(req.query.newPassword != "" && sess.password != req.query.newPassword)
			{
				await Profile.findOneAndUpdate({username: sess.username},{password: req.query.password})
				sess.password = req.query.newPassword
			}
			
			res.render('profile.hbs', {
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum
			})
		}
		catch(err)
		{
			res.status(500).send(err)
		}
	}
	else{
		res.redirect('/submit-login')
	}
});



app.get('/assignments', async(req,res)=> {
	sess = req.session;
	if(sess.username){
		if(sess.username=="admin")
		{ // if admin, show unfinished assignments
			const ass = await Assignment.find({
				comment: {$ne: "Approved."}})	//ne = not equal
			
			res.render('assignments_admin.hbs', {
				assignment:ass,
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
			})
		}
		else{
			const ass = await Assignment.find({
				assigned_to: sess.username,
				comment: {$ne: "Approved."}})	//ne = not equal
			
			res.render('assignments.hbs', {
				assignment:ass,
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
			})
		}
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
			password: sess.password,
            remember: sess.remember,
			acct_id: sess.acct_id,
            email   : sess.email,
            fname   : sess.fname,
            lname   : sess.lname,
            appNum  : sess.appNum,
			appExp  : sess.appExp
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


/*		THIS IS THE PDF THING	
https://www.geeksforgeeks.org/how-to-create-pdf-document-in-node-js/	*/
const PDFDocument = require('pdfkit');

// this is the output file
const doc = new PDFDocument;

doc
.fontSize(15)




