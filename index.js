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


// land here
app.get('/',(req,res)=> {
	res.redirect('login.html');
})

// destroy session at log out
app.get('/logout',(req,res)=> {
	req.session.destroy((err)=> {
		if(err){
			return console.log(err);
		}
		res.redirect('login.html');
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
		console.log(acct)
		
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
				sess.acct_id  = acct.acct_id,
				sess.email	  = acct.email,
				sess.status   = acct.status,
                sess.fname	  = acct.fname,
                sess.lname    = acct.lname,
                sess.appNum   = acct.appNum,
                sess.appexp   = acct.appexp
				
				if(req.query.username == "admin")
				{
					res.redirect('/assignments');
				}
				else
				{
					res.redirect('/dashboard');

					// RENDER DASHBOARD
					// res.render('dashboard.hbs', {
						// username: acct.username,
						// remember: acct.remember,
						// status: sess.status,
						// password: acct.password,
						// acct_id : acct.acct_id,
						// email   : acct.email,
						// fname   : acct.fname,
						// lName   : acct.lName,
						// appNum  : acct.appNum,
						// appexp : acct.appexp
						// //this is like in java: this.data = data	
					// })
				}
			}
			else
			{
				console.log("Password incorrect! Pass:" + acct.password)
				res.redirect('/login-fail-not-exist.html');
				// will just show a red text to let you know your acct details were wrong
			}
		}
		else //username is not found.
		{
			res.redirect('/login-fail-not-exist.html');
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
				status: sess.status,
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
				status: sess.status,
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


app.get('/save-ass', async(req,res)=> {
	sess = req.session;
	if(sess.username){
		try{
			//edit comment  to "Submitted."
			// await Assignment.findOneAndUpdate({ref_id: req.params.ref_id},{comment: "Submitted."})
			// sess.status = true
			// res.redirect('/assignments')
			// ref_id: String,
	// type_of_approach: String,
	// client_f_name: String,
	// client_l_name: String,
	// property_images: String,
	// lot_size: String,
	// trans_date: String,
	// purchase_price: String,
	// listing_price: String,
	// terms_of_sale: String,
	// location: String,
	// corner: Boolean,
	// shape: String,
	// topo: String,
	// area: Number,
	// completed_on: Date,
	// comment: String,
	// assigned_to: String,
	// created_at:
	
	
	
	
	
			//dont care for empty, save all edits
			// await Assignment.findOneAndUpdate({lot_size: res.query.lot_size},{username: req.query.username})
			// sess.username = req.query.username
			
			
			// await Account.findOneAndUpdate({username: sess.username},{bio: req.query.bio})
			// sess.bio = req.query.bio;
			
			// if(req.query.newPassword != "" && sess.password != req.query.newPassword)
			// {
				// await Account.findOneAndUpdate({username: sess.username},{password: req.query.password})
				// sess.password = req.query.newPassword
			// }
			
			res.redirect('/viewAssignment/:ref_id')
		}
		catch(err)
		{
			res.status(500).send(err)
		}
	}
	else{
		res.redirect('/login-fail.html')
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
				await Account.findOneAndUpdate({username: sess.username},{username: req.query.username})
				sess.username = req.query.username
			}
			
			await Account.findOneAndUpdate({username: sess.username},{bio: req.query.bio})
			sess.bio = req.query.bio;
			
			if(req.query.newPassword != "" && sess.password != req.query.newPassword)
			{
				await Account.findOneAndUpdate({username: sess.username},{password: req.query.password})
				sess.password = req.query.newPassword
			}
			
			res.redirect('/profile')
			
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


app.get('/submit-ass', async(req,res)=> {
	sess = req.session;
	if(sess.username){
		try{
			//edit comment  to "Submitted."
			await Assignment.findOneAndUpdate({ref_id: req.params.ref_id},{comment: "Submitted."})
			sess.status = true
			res.redirect('/assignments')
		}
		catch(err)
		{
			res.status(500).send(err)
		}
	}
	else{
		res.redirect('/login-fail.html')
	}
});



//TODO!	//change the comment to "Approved.", if approved, can be printed
app.get('/admin-approve', async(req,res)=>{
	sess = req.session;
	if(sess.username)
	{
		try{
			// await Assignment.findOneAndUpdate({res: sess.username},{comment: true})
			// const ass = await Assignment.findOneAndUpdate({res: req.params.ref_id},{comment: "test"})
			// req.params.ref_id
			console.log(req.params.ref_id)
			res.redirect('/history')
		}
		catch(err){
			console.log(err)
		}
	}
	else{
		res.redirect('/login-fail.html')
	}
})

//this submits the comment and updates the assignment
app.get('/admin-comment', async(req,res)=>{
	sess = req.session;
	if(sess.username)
	{
		try{
			// await Assignment.findOneAndUpdate({res: sess.username},{comment: true})
			// const ass = await Assignment.findOneAndUpdate({res: req.params.ref_id},{comment: "test"})
			// req.params.ref_id
			const ass = await Assignment.findOneAndUpdate({
				res: req.params.ref_id},
				{comment: req.params.comment})
			
			res.redirect('/history')
		}
		catch(err){
			console.log(err)
		}
	}
	else{
		res.redirect('/login-fail.html')
	}
})
//TODO make this functional, as in working if you click save
app.get('/admin-add-assignment', function(req,res) {
	sess = req.session
	
	res.render('addAssignment.hbs',{
		username: sess.username,
		password: sess.password,
		status: sess.status,
		remember: sess.remember,
		acct_id: sess.acct_id,
		email   : sess.email,
		fname   : sess.fname,
		lname   : sess.lname,
		appNum  : sess.appNum,
		appExp  : sess.appExp
	});
				
});

app.get('/view/0/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id
	
	if(sess.username)
	{//TODO
		if(sess.username == "admin")
		{	//if admin, cannot edit, but can comment
			const ass = await Assignment.findOne({
				id : ref_id
				}).exec()
				
				res.render('viewAssignment_0_admin.hbs',{
					ref_id : ass.ref_id,
					type_of_approach: ass.type_of_approach,
					client_f_name : ass.client_f_name,
					client_l_name : ass.client_l_name,
					loc_brgy : ass.loc_brgy,
					loc_city : ass.loc_city,
					loc_region : ass.loc_region,
					
					property_images: ass.property_images,
					lot_size: ass.lot_size,
					trans_date: ass.trans_date,
					purchase_price: ass.purchase_price,
					listing_price: ass.listing_price,
					terms_of_sale: ass.terms_of_sale,
					corner: ass.corner,
					shape: ass.shape,
					topo: ass.topo,
					area: ass.area,
					completed_on: ass.completed_on,
					comment: ass.comment,
					assigned_to: ass.assigned_to,
					created_at: ass.created_at,
					
					username: sess.username,
					password: sess.password,
					status: sess.status,
					remember: sess.remember,
					acct_id: sess.acct_id,
					email   : sess.email,
					fname   : sess.fname,
					lname   : sess.lname,
					appNum  : sess.appNum,
					appExp  : sess.appExp
				});
				
		}
		else// if (sess.username != "admin")
		{
		
			const ass = await Assignment.findOne({
				ref_id : ref_id
				}).exec()
			res.render('viewAssignment_0.hbs',{
				ref_id : ass.ref_id,
				type_of_approach: ass.type_of_approach,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				loc_brgy : ass.loc_brgy,
				loc_city : ass.loc_city,
				loc_region : ass.loc_region,
				
				property_images: ass.property_images,
				lot_size: ass.lot_size,
				trans_date: ass.trans_date,
				purchase_price: ass.purchase_price,
				listing_price: ass.listing_price,
				terms_of_sale: ass.terms_of_sale,
				corner: ass.corner,
				shape: ass.shape,
				topo: ass.topo,
				area: ass.area,
				completed_on: ass.completed_on,
				comment: ass.comment,
				assigned_to: ass.assigned_to,
				created_at: ass.created_at,
				
				username: sess.username,
				password: sess.password,
				status: sess.status,
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


// Comparative 1   TODO: remove the pictures part(?) need confirmation
app.get('/view/1/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id

	if(sess.username)
	{
		if(sess.username == "admin")
		{	//if admin, cannot edit, but can comment
			const ass = await Assignment.findOne({
				ref_id: req.params.ref_id
			}).exec()
			
			res.render('viewAssignment_1_admin.hbs',{
				ref_id : ass.ref_id,
				type_of_approach: ass.type_of_approach,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				loc_brgy : ass.loc_brgy,
				loc_city : ass.loc_city,
				loc_region : ass.loc_region,
				
				lot_size: ass.comparative2.lot_size,
				trans_date: ass.comparative2.trans_date,
				purchase_price: ass.comparative2.purchase_price,
				listing_price: ass.comparative2.listing_price,
				terms_of_sale: ass.comparative2.terms_of_sale,
				corner: ass.comparative2.corner,
				shape: ass.comparative2.shape,
				topo: ass.comparative2.topo,
				area: ass.comparative2.area,
				comment: ass.comment,
				
				username: sess.username,
				password: sess.password,
				status: sess.status,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
				
			}).exec()
		}
		else// if (sess.username != "admin")
		{
			const ass = await Assignment.findOne({
				assigned_to: sess.username})
			.exec()
		
			res.render('viewAssignment_1.hbs',{
				ref_id : ass.ref_id,
				type_of_approach: ass.type_of_approach,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				loc_brgy : ass.loc_brgy,
				loc_city : ass.loc_city,
				loc_region : ass.loc_region,
				
				property_images: ass.comparative1.property_images,
				lot_size: ass.comparative1.lot_size,
				trans_date: ass.comparative1.trans_date,
				purchase_price: ass.comparative1.purchase_price,
				listing_price: ass.comparative1.listing_price,
				terms_of_sale: ass.comparative1.terms_of_sale,
				corner: ass.comparative1.corner,
				shape: ass.comparative1.shape,
				topo: ass.comparative1.topo,
				area: ass.comparative1.area,
				comment: ass.comment,
				
				username: sess.username,
				password: sess.password,
				status: sess.status,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
				
			}).exec()
		}
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});


// Comparative 2 -> TODO: remove the pictures part(?) need confirmation
app.get('/view/2/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id

/*
	console.log(req.params)
	const ass = await Assignment.find({
		assigned_to: sess.username,
		ref_id: req.params.ref_id}).exec()
	console.log(ass)
	*/
	if(sess.username)
	{//TODO
		if(sess.username == "admin")
		{	
			const ass = await Assignment.findOne({
				ref_id : ref_id
				}).exec()
				
			res.render('viewAssignment_2_admin.hbs',{
				ref_id : ass.ref_id,
				type_of_approach: ass.type_of_approach,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				loc_brgy : ass.loc_brgy,
				loc_city : ass.loc_city,
				loc_region : ass.loc_region,
				
				property_images: ass.comparative2.property_images,
				lot_size: ass.comparative2.lot_size,
				trans_date: ass.comparative2.trans_date,
				purchase_price: ass.comparative2.purchase_price,
				listing_price: ass.comparative2.listing_price,
				terms_of_sale: ass.comparative2.terms_of_sale,
				corner: ass.comparative2.corner,
				shape: ass.comparative2.shape,
				topo: ass.comparative2.topo,
				area: ass.comparative2.area,
				comment: ass.comment,
				
				username: sess.username,
				password: sess.password,
				status: sess.status,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
				
			}).exec()
		}
		else
		{
		
			const ass = await Assignment.findOne({
				ref_id : ref_id
			}).exec()
	
			res.render('viewAssignment_2.hbs',{
				ref_id : ass.ref_id,
				type_of_approach: ass.type_of_approach,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				loc_brgy : ass.loc_brgy,
				loc_city : ass.loc_city,
				loc_region : ass.loc_region,
				
				property_images: ass.comparative2.property_images,
				lot_size: ass.comparative2.lot_size,
				trans_date: ass.comparative2.trans_date,
				purchase_price: ass.comparative2.purchase_price,
				listing_price: ass.comparative2.listing_price,
				terms_of_sale: ass.comparative2.terms_of_sale,
				corner: ass.comparative2.corner,
				shape: ass.comparative2.shape,
				topo: ass.comparative2.topo,
				area: ass.comparative2.area,
				comment: ass.comment,
				
				username: sess.username,
				password: sess.password,
				status: sess.status,
				remember: sess.remember,
				acct_id: sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp
				
			}).exec()
		}
		
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});




//THIS IS THE "PROPERTY" VIEW
app.get('/viewAssignment/0/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id

/*
	console.log(req.params)
	const ass = await Assignment.find({
		assigned_to: sess.username,
		ref_id: req.params.ref_id}).exec()
	console.log(ass)
	
	*/
	if(sess.username)
	{
		/*
		if(sess.username == "admin")
		{	//if admin, cannot edit, but can comment
			// const ass = await Assignment.findOne({
				// id : ref_id
				// }).exec()
				
			console.log(ass)
			
			res.render('/viewAssignment_admin.hbs', {
				ref_id : id,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				loc_brgy : ass.loc_brgy,
				loc_city : ass.loc_city,
				loc_region : ass.loc_region,
				
				username: sess.username,
				status: sess.status,
				remember: sess.remember,
				password: sess.password,
				acct_id : sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lName   : sess.lName,
				appNum  : sess.appNum,
				appExp : sess.appExp
			});
			
			// sess.currentAss = ref_id
		}
		else// if (sess.username != "admin")
		{
*/
			
			res.redirect('/view/0/'+req.params.ref_id);
		/*}*/
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});



//THIS IS THE "COMPARATIVE 1" VIEW
app.get('/viewAssignment/1/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id

/*
	console.log(req.params)
	const ass = await Assignment.find({
		assigned_to: sess.username,
		ref_id: req.params.ref_id}).exec()
	console.log(ass)
	*/
	
	if(sess.username)
	{
		res.redirect('/view/1/'+req.params.ref_id);
			
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});


//THIS IS THE "COMPARATIVE II" VIEW
app.get('/viewAssignment/2/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id

	
	if(sess.username)
	{
		res.redirect('/view/2/'+req.params.ref_id);
	}
	else
	{		
		res.redirect('/login-fail.html')
	}
});




//TODO make this functional, as in working if you click save
app.post('/submit-assignment', function(req,res) {
	sess = req.session
	
	var ref_id = req.body.ref_id
	
	Assignment.create(
	{
		ref_id : req.body.ref_id,
		client_f_name : req.body.client_f_name,
		client_l_name : req.body.client_f_name,
		loc_brgy : req.body.loc_brgy,
		loc_city : req.body.loc_city,
		loc_region : req.body.loc_region,
	
		//add empty comparative
		comparative1 : {
			lot_size: 0,
			listing_price: 0,
			terms_of_sale: "",
			loc_city: "",
			loc_region: "",
			loc_brgy: "",
			corner: 0,
			school: 0,
			hospital: 0,
			mall: 0,
			shape: "",
			topo: "",
			area: 0
		},

		//add empty comparative
		comparative2 : {
			lot_size: 0,
			listing_price: 0,
			terms_of_sale: "",
			loc_city: "",
			loc_region: "",
			loc_brgy: "",
			corner: 0,
			school: 0,
			hospital: 0,
			mall: 0,
			shape: "",
			topo: "",
			area: 0
		}
	})
	
	res.redirect('/assignments_admin')

	/*
	res.redirect('/view/0/'+req.params.ref_id);
	{
		username: sess.username,
		password: sess.password,
		status: sess.status,
		email   : sess.email,
		fname   : sess.fname,
		lname   : sess.lname,

		ref_id : req.body.ref_id
		client_f_name : req.body.client_f_name
		client_l_name : req.body.client_f_name
		loc_brgy : req.body.loc_brgy
		loc_city : req.body.loc_city
		loc_region : req.body.loc_region
	})*/
});


app.get('/dashboard', async(req,res)=> {
	sess = req.session;
	if(sess.username){ //username exists
		if(sess.username=="admin")
		{
			res.render('dashboard.hbs', {
				username: sess.username,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname
			}
		)}
		else{	//regular user - non admin
			if(sess.status) //activa yung account
			{
				
				//eto yung you have blank new comments saka mag eexpire na dates
				const assNum = await Assignment.find({
					assigned_to: sess.username,
					comment: {$ne: "Approved."},
					comment: {$ne: "Submitted."},
					comment: {$ne: ""},
					}).count()
					//so if the comment is not approved, and submitted, and not blank also, it's from the admin
					
				const assDl = await Assignment.find({
					createdAt: { $gt: { $add: [ "$someDate", -1000 * 3600 * 24 * 3 ] } }
					});


				res.render('dashboard.hbs', {
					username: sess.username,
					password: sess.password,
					status: sess.status,
					remember: sess.remember,
					acct_id: sess.acct_id,
					email   : sess.email,
					fname   : sess.fname,
					lname   : sess.lname,
					appNum  : sess.appNum,
					appExp  : sess.appExp,
					newnotif: assNum,
					// deadlines:
				})
			}
			else{
				res.render('dashboard_unactivated.hbs', {
					username: sess.username,
					email   : sess.email,
					fname   : sess.fname,
					lname   : sess.lname
				})
			}
		}
	}
	else{
		res.redirect('/login-fail.html')
		//res.redirect('/submit-login')
		//if you're trying to access the profile page but you're not logged in
	}
});

// app.post('/submit-post', function(req,res){
	// viewAssignment.create(req.body, (error,post) =>
	// {
        // res.redirect('/')
	// })
// })




//TODO make this functional, as in working if you click save
//  check if there are changes and save only the ones that are not blank
app.get('/settings', (req,res)=> {
	sess = req.session;
	if(sess.username){
		res.render('settings.hbs', {
            username: sess.username,
			status  : sess.status,
			password: sess.password,
            remember: sess.remember,
			acct_id : sess.acct_id,
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


app.get('/term-accept', async(req,res)=> {
	sess = req.session;
	if(sess.username){
		try{
			//render with new data
			await Account.findOneAndUpdate({username: sess.username},{status: true})
			sess.status = true
			res.redirect('/profile')
		}
		catch(err)
		{
			res.status(500).send(err)
		}
	}
	else{
		res.redirect('/login-fail.html')
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
				await Account.findOneAndUpdate({username: sess.username},{username: req.query.username})
				sess.username = req.query.username
			}
			
			await Account.findOneAndUpdate({username: sess.username},{bio: req.query.bio})
			sess.bio = req.query.bio;
			
			if(req.query.newPassword != "" && sess.password != req.query.newPassword)
			{
				await Account.findOneAndUpdate({username: sess.username},{password: req.query.password})
				sess.password = req.query.newPassword
			}
			
			res.redirect('/profile')
			
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
				status: sess.status,
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
				status: sess.status,
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
			status: sess.status,
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

//TODO: idk if we need this or why do we have this?
app.post('/submit-post', function(req,res){
	viewAssignment.create(req.body, (error,post) =>
	{
        res.redirect('/')
	})
})

app.get('/terms', function(req,res){
	sess = req.session;
	if(sess.username){
		if (sess.status)
		{
			res.render('terms_active.hbs', {
				username: sess.username,
				password: sess.password,
				status	: sess.status,
				remember: sess.remember,
				acct_id : sess.acct_id,
				email   : sess.email,
				fname   : sess.fname,
				lname   : sess.lname,
				appNum  : sess.appNum,
				appExp  : sess.appExp			
				})
		}
		else{
			res.render('terms.hbs', {
				username: sess.username,
				password: sess.password,
				status	: sess.status,
				remember: sess.remember,
				acct_id	: sess.acct_id,
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
})

var server = app.listen(3000,function(){
});

app.get('/viewAssignment', function(req,res){
	res.redirect('/assignments')
});


/*		THIS IS THE PDF THING	
https://www.geeksforgeeks.org/how-to-create-pdf-document-in-node-js/	*/
const PDFDocument = require('pdfkit');

// this is the output file
const doc = new PDFDocument;

doc
.fontSize(15)




