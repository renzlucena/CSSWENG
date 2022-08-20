const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/appraisers-db')

const express = require('express')
const app = new express()
//for session
const session = require('express-session');

//schemas
const Assignment = require('./database/models/assignment')
const Account = require('./database/models/account')
const Document = require('./database/models/document')

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
			const ass = await Assignment.find({
				comment: "Approved."
			})

			res.render('history_admin.hbs', {
				assignment : ass,

				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
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
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
			});
		}
	}
	else
	{
		res.redirect('/login-fail.html')
	}
});



/*
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

			await Account.findOneAndUpdate({username: sess.username},{email: req.query.email})
			sess.email = req.query.email;

			await Account.findOneAndUpdate({username: sess.username},{fname: req.query.fname})
			sess.fname = req.query.fname;

			await Account.findOneAndUpdate({username: sess.lname},{email: req.query.lname})
			sess.lname = req.query.lname;

			await Account.findOneAndUpdate({username: sess.username},{appnum: req.query.appnum})
			sess.appnum = req.query.appnum;

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
*/

/*app.get('/create-document', async(req,res))=>
{
	sess.username)



	//ADD NEW DOCUMENT
		try{
			Assignment.create(
			{
				ref_id: req.body.ref_id,
				type_of_approach: "Market Approach",
				client_f_name: req.body.client_f_name,
				client_l_name: req.body.client_l_name,
				client_contact_num: req.body.client_contact_num,
				client_email: req.body.client_email,
				lot_brgy: req.body.lot_brgy,
				lot_city: req.body.lot_city,
				lot_region: req.body.lot_region,
				zonal: req.body.zonal,
				assigned_to: "",

				//no dates because they have default values already
				price_per_sqm: 0,
				lot_loc: "",
				property_type: "",
				property_interest: "",
				// property_images: [imageSchema], //REPORT AS MISSING FEATURE NALANG, WE CAN'T IMPLEMENT THIS AT THIS TIME...
				lot_size: req.body.lot_size,
				shape: "",
				topo: "",
				frontage: "",
				terms_of_sale: "",
				corner: false,
				prime: false,
				hospital: false,
				school: false,
				mall:   false,
				public_transpo: "",
				improvement: false,
				zoning: "",
				computation: {num1: 0, num2: 0},
				//don't set comment because it has a default value that marks it as "New!"

				//add empty comparative
				comparative1 : {
					price_per_sqm: 0,
					ref_date: {date: null, num: 0}, //idk if this works
					lot_loc: "",
					property_type: {str: "", num:0},
					property_interest: {str:"",num:0},
					//tut: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
					// property_images: [imageSchema],
					lot_size: {num1: 0, num2: 0},
					shape: {str: "", num:0},
					topo: {str: "", num:0},
					frontage: {str: "", num:0},
					terms_of_sale: {str: "", num:0},
					corner: {bool:0,num:0},
					prime: {bool:0,num:0},
					hospital: {bool:0,num:0},
					school: {bool:0,num:0},
					mall: {bool:0,num:0},
					public_transpo: {str:"", num:0},
					improvement: {bool:0,num:0},
					zoning: {str: "", num:0},
					computation: {num1: 0, num2: 0}
				},

				//add empty comparative
				comparative2 : {
					price_per_sqm: 0,
					ref_date: {date: null, num: 0},
					lot_loc: "",
					property_type: {str: "", num:0},
					property_interest: {str:"",num:0},
					// property_images: [imageSchema],
					lot_size: {num1: 0, num2: 0},
					shape: {str: "", num:0},
					topo: {str: "", num:0},
					frontage: {str: "", num:0},
					terms_of_sale: {str: "", num:0},
					corner: {bool:0,num:0},
					prime: {bool:0,num:0},
					hospital: {bool:0,num:0},
					school: {bool:0,num:0},
					mall: {bool:0,num:0},
					public_transpo: {str: "", num:0},
					improvement: {bool:0,num:0},
					zoning: {str: "", num:0},
					computation: {num1: 0, num2: 0}
				}
			})
		}
		catch(err)
		{console.log(err)}
}
		*/

// SEND ASSIGNMENT TO ADMIN FOR FEEDBACK
// "Send for Processing" - will change the comment to "Submitted.", then admin will be able to see it sent to them.
app.get('/send-ass', async(req,res)=> {
	sess = req.session;
	console.log("in /send-ass "+req.query)
	if(sess.username){
		try{
			//edit comment to "Submitted."

			await Assignment.findOneAndUpdate(
				{ref_id: req.query.ref_id},
				{comment: "Submitted."}).exec()
			// await Document:findOneAndUpdate(
				// {ref_id: req.query.ref_id},
				// {})

			var ref_id = req.body.ref_id
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

//TODO: PROBLEM : Items are in readonly so they don't get passed
//TODO!	//change the comment to "Approved.", if approved, can be printed
app.get('/admin-approve', async(req,res)=>{
	sess = req.session;
	if(sess.username)
	{
		try{
			// await Assignment.findOneAndUpdate({res: sess.username},{comment: true})
			// const ass = await Assignment.findOneAndUpdate({res: req.params.ref_id},{comment: "test"})
			// req.params.ref_id
			//console.log(req.params.ref_id)
			
			await Assignment.findOneAndUpdate(
				// {ref_id: req.query.ref_id},
				{ref_id: req.query.ref_id},
				{comment: "Approved."})
			console.log(req)
			// console.log(params)

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

			const ass = await Assignment.findOneAndUpdate(
				{ref_id: req.query.ref_id},
				// {comment: "Returned: " + req.query.comment
				{comment: req.query.comment
				})

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
function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
// ('0' + 4).slice(-2)

// this is just the page, the one that saves a new document is "/submit-assignment"
app.get('/admin-add-assignment', async(req,res)=>{
	sess = req.session
	// try{
	var year = new Date();

	// console.log(year.getFullYear().toString())

	//const count = await Assignment.countDocuments().exec()

	// res.render('addAssignment.hbs',{

		// ref_id	:	year.getDate.toString	//test
	// });


	if(sess.username=="admin")
	{
		const count = await Assignment.countDocuments().exec()

		res.render('addAssignment.hbs',{
			username: sess.username,
			password: sess.password,
			remember: sess.remember,
			status: sess.status,
			email: sess.email,
			fname: sess.fname,
			lname: sess.lname,
			appnum: sess.appnum,
			can_accept: sess.can_accept,

			ref_id	:	(year.getFullYear()-2000).toString()+year.getMonth().toString()+padLeadingZeros((count+1), 3)
			
		});
	}
	else{
		res.redirect('/login-fail.html')
	}

});

app.get('/view/0/:ref_id', async(req,res)=>{
	sess = req.session
	var ref_id = req.params.ref_id
	console.log("/view/0/:"+ref_id)
	
	if(sess.username)
	{
		if(sess.username == "admin")
		{			// IF ADMIN IS LOGGED IN
			try{
				const ass = await Assignment.findOne({
						ref_id : req.params.ref_id
					})
					
					console.log(ass)

					//	IF IN HISTORY (comment="Approved.")
					if(ass.comment == "Approved.")
					{	res.render('history_0_admin.hbs',{
							ref_id 			: ass.ref_id,
							type_of_approach: ass.type_of_approach,
							client_f_name 	: ass.client_f_name,
							client_l_name 	: ass.client_l_name,
							lot_brgy		: ass.lot_brgy,
							lot_city		: ass.lot_city,
							lot_region		: ass.lot_region,
							zonal			: ass.zonal,
							assigned_to		: ass.assigned_to,

							//dates
							ref_date		: ass.ref_date,
							created_at		: (ass.created_at.getMonth().toString())+" "+ass.created_at.getFullYear().toString(),
							completed_on	: ass.completed_on,
							expiring_on 	: ass.expiring_on,

							price_per_sqm	: ass.price_per_sqm,
							lot_loc			: ass.lot_loc,
							property_type	: ass.property_type,
							property_interest: ass.property_interest,
							// property_images: [imageSchema],
							lot_size		: ass.lot_size,
							shape			: ass.shape,
							topo			: ass.topo,
							frontage		: ass.frontage,
							terms_of_sale	: ass.terms_of_sale,
							corner			: ass.corner,
							prime			: ass.prime,
							hospital		: ass.hospital,
							school			: ass.school,
							mall			: ass.mall,

							public_transpo	: ass.public_transpo,
							improvement		: ass.improvement,
							zoning			: ass.zoning,
							computation		: ass.computation,

							//comment
							comment: ass.comment,

						// COMPARATIVE I
							price_per_sqm1		: ass.comparative1.price_per_sqm,
							ref_date1			: ass.comparative1.ref_date.date, //idk if this works
							lot_loc1			: ass.comparative1.lot_loc,
							property_type1		: ass.comparative1.property_type.str,
							property_interest1	: ass.comparative1.property_interest.str,
							// property_images: [imageSchema],
							lot_size1			: ass.comparative1.lot_size.num1,
							shape1				: ass.comparative1.shape.str,
							topo1				: ass.comparative1.topo.str,
							frontage1			: ass.comparative1.frontage.str,
							terms_of_sale1		: ass.comparative1.terms_of_sale.str,
							corner1				: ass.comparative1.corner.bool,
							prime1				: ass.comparative1.prime.bool,
							hospital1			: ass.comparative1.hospital.bool,
							school1				: ass.comparative1.school.bool,
							mall1				: ass.comparative1.mall.bool,
							public_transpo1		: ass.comparative1.public_transpo.str,
							improvement1		: ass.comparative1.improvement.bool,
							zoning1				: ass.comparative1.zoning.str,
							computation1		: ass.comparative1.computation.num1,

				// COMPARATIVE I - percent1's
							ref_date_percent1			: ass.comparative1.ref_date.num,
							property_type_percent1		: ass.comparative1.property_type.num,
							property_interest_percent1	: ass.comparative1.property_interest.num,
							lot_size_percent1			: ass.comparative1.lot_size.num2,
							shape_percent1				: ass.comparative1.shape.num,
							topo_percent1				: ass.comparative1.topo.num,
							frontage_percent1			: ass.comparative1.frontage.num,
							terms_of_sale_percent1		: ass.comparative1.terms_of_sale.num,
							corner_percent1				: ass.comparative1.corner.num,
							prime_percent1				: ass.comparative1.prime.num,
							hospital_percent1			: ass.comparative1.hospital.num,
							school_percent1				: ass.comparative1.school.num,
							mall_percent1				: ass.comparative1.mall.num,
							public_transpo_percent1		: ass.comparative1.public_transpo.num,
							improvement_percent1		: ass.comparative1.improvement.num,
							zoning_percent1				: ass.comparative1.zoning.num,
							computation_percent1		: ass.comparative1.computation.num2,

				//	COMPARATIVE II
							price_per_sqm2		: ass.comparative2.price_per_sqm,
							ref_date2			: ass.comparative2.ref_date.date, //idk if this works
							lot_loc2			: ass.comparative2.lot_loc,
							property_type2		: ass.comparative2.property_type.str,
							property_interest2	: ass.comparative2.property_interest.str,
							// property_images: [imageSchema],
							lot_size2			: ass.comparative2.lot_size.num1,
							shape2				: ass.comparative2.shape.str,
							topo2				: ass.comparative2.topo.str,
							frontage2			: ass.comparative2.frontage.str,
							terms_of_sale2		: ass.comparative2.terms_of_sale.str,
							corner2				: ass.comparative2.corner.bool,
							prime2				: ass.comparative2.prime.bool,
							hospital2			: ass.comparative2.hospital.bool,
							school2				: ass.comparative2.school.bool,
							mall2				: ass.comparative2.mall.bool,
							public_transpo2		: ass.comparative2.public_transpo.str,
							improvement2		: ass.comparative2.improvement.bool,
							zoning2				: ass.comparative2.zoning.str,
							computation2		: ass.comparative2.computation.num1,

				// COMPARATIVE II - percent2's
							ref_date_percent2			: ass.comparative2.ref_date.num,
							property_type_percent2		: ass.comparative2.property_type.num,
							property_interest_percent2	: ass.comparative2.property_interest.num,
							lot_size_percent2			: ass.comparative2.lot_size.num2,
							shape_percent2				: ass.comparative2.shape.num,
							topo_percent2				: ass.comparative2.topo.num,
							frontage_percent2			: ass.comparative2.frontage.num,
							terms_of_sale_percent2		: ass.comparative2.terms_of_sale.num,
							corner_percent2				: ass.comparative2.corner.num,
							prime_percent2				: ass.comparative2.prime.num,
							hospital_percent2			: ass.comparative2.hospital.num,
							school_percent2				: ass.comparative2.school.num,
							mall_percent2				: ass.comparative2.mall.num,
							public_transpo_percent2		: ass.comparative2.public_transpo.num,
							improvement_percent2		: ass.comparative2.improvement.num,
							zoning_percent2				: ass.comparative2.zoning.num,
							computation_percent2		: ass.comparative2.computation.num2,

							username: sess.username,
							password: sess.password,
							remember: sess.remember,
							status: sess.status,
							email: sess.email,
							fname: sess.fname,
							lname: sess.lname,
							appnum: sess.appnum,
							can_accept: sess.can_accept
						});
				}
					//	IF REVIEWING SUBMITTED ASSIGNMENTS (comment="Submitted.")
				else if (ass.comment == "Submitted."){
					res.render('viewAssignment_0_admin.hbs',{
						ref_id 			: ass.ref_id,
						type_of_approach: ass.type_of_approach,
						client_f_name 	: ass.client_f_name,
						client_l_name 	: ass.client_l_name,
						lot_brgy		: ass.lot_brgy,
						lot_city		: ass.lot_city,
						lot_region		: ass.lot_region,
						zonal			: ass.zonal,
						assigned_to		: ass.assigned_to,

						//dates
						ref_date		: ass.ref_date,
						created_at		: (ass.created_at.getMonth().toString())+" "+ass.created_at.getFullYear().toString(),
						completed_on	: ass.completed_on,
						expiring_on 	: ass.expiring_on,

			// SUPJECT PROPERTY
						price_per_sqm	: ass.price_per_sqm,
						lot_loc			: ass.lot_loc,
						property_type	: ass.property_type,
						property_interest: ass.property_interest,
						// property_images: [imageSchema],
						lot_size		: ass.lot_size,
						shape			: ass.shape,
						topo			: ass.topo,
						frontage		: ass.frontage,
						terms_of_sale	: ass.terms_of_sale,
						corner			: ass.corner,
						prime			: ass.prime,
						hospital		: ass.hospital,
						school			: ass.school,
						mall				: ass.mall,
						public_transpo	: ass.public_transpo,
						improvement		: ass.improvement,
						zoning			: ass.zoning,
						computation		: ass.computation,

						//comment
						comment: ass.comment,

			// COMPARATIVE I
							price_per_sqm1		: ass.comparative1.price_per_sqm,
							ref_date1			: ass.comparative1.ref_date.date, //idk if this works
							lot_loc1			: ass.comparative1.lot_loc,
							property_type1		: ass.comparative1.property_type.str,
							property_interest1	: ass.comparative1.property_interest.str,
							// property_images: [imageSchema],
							lot_size1			: ass.comparative1.lot_size.num1,
							shape1				: ass.comparative1.shape.str,
							topo1				: ass.comparative1.topo.str,
							frontage1			: ass.comparative1.frontage.str,
							terms_of_sale1		: ass.comparative1.terms_of_sale.str,
							corner1				: ass.comparative1.corner.bool,
							prime1				: ass.comparative1.prime.bool,
							hospital1			: ass.comparative1.hospital.bool,
							school1				: ass.comparative1.school.bool,
							mall1				: ass.comparative1.mall.bool,
							public_transpo1		: ass.comparative1.public_transpo.str,
							improvement1		: ass.comparative1.improvement.bool,
							zoning1				: ass.comparative1.zoning.str,
							computation1		: ass.comparative1.computation.num1,

				// COMPARATIVE I - percent1's
							ref_date_percent1			: ass.comparative1.ref_date.num,
							property_type_percent1		: ass.comparative1.property_type.num,
							property_interest_percent1	: ass.comparative1.property_interest.num,
							lot_size_percent1			: ass.comparative1.lot_size.num2,
							shape_percent1				: ass.comparative1.shape.num,
							topo_percent1				: ass.comparative1.topo.num,
							frontage_percent1			: ass.comparative1.frontage.num,
							terms_of_sale_percent1		: ass.comparative1.terms_of_sale.num,
							corner_percent1				: ass.comparative1.corner.num,
							prime_percent1				: ass.comparative1.prime.num,
							hospital_percent1			: ass.comparative1.hospital.num,
							school_percent1				: ass.comparative1.school.num,
							mall_percent1				: ass.comparative1.mall.num,
							public_transpo_percent1		: ass.comparative1.public_transpo.num,
							improvement_percent1		: ass.comparative1.improvement.num,
							zoning_percent1				: ass.comparative1.zoning.num,
							computation_percent1		: ass.comparative1.computation.num2,

				//	COMPARATIVE II
							price_per_sqm2		: ass.comparative2.price_per_sqm,
							ref_date2			: ass.comparative2.ref_date.date, //idk if this works
							lot_loc2			: ass.comparative2.lot_loc,
							property_type2		: ass.comparative2.property_type.str,
							property_interest2	: ass.comparative2.property_interest.str,
							// property_images: [imageSchema],
							lot_size2			: ass.comparative2.lot_size.num1,
							shape2				: ass.comparative2.shape.str,
							topo2				: ass.comparative2.topo.str,
							frontage2			: ass.comparative2.frontage.str,
							terms_of_sale2		: ass.comparative2.terms_of_sale.str,
							corner2				: ass.comparative2.corner.bool,
							prime2				: ass.comparative2.prime.bool,
							hospital2			: ass.comparative2.hospital.bool,
							school2				: ass.comparative2.school.bool,
							mall2				: ass.comparative2.mall.bool,
							public_transpo2		: ass.comparative2.public_transpo.str,
							improvement2		: ass.comparative2.improvement.bool,
							zoning2				: ass.comparative2.zoning.str,
							computation2		: ass.comparative2.computation.num1,

				// COMPARATIVE II - percent2's
							ref_date_percent2			: ass.comparative2.ref_date.num,
							property_type_percent2		: ass.comparative2.property_type.num,
							property_interest_percent2	: ass.comparative2.property_interest.num,
							lot_size_percent2			: ass.comparative2.lot_size.num2,
							shape_percent2				: ass.comparative2.shape.num,
							topo_percent2				: ass.comparative2.topo.num,
							frontage_percent2			: ass.comparative2.frontage.num,
							terms_of_sale_percent2		: ass.comparative2.terms_of_sale.num,
							corner_percent2				: ass.comparative2.corner.num,
							prime_percent2				: ass.comparative2.prime.num,
							hospital_percent2			: ass.comparative2.hospital.num,
							school_percent2				: ass.comparative2.school.num,
							mall_percent2				: ass.comparative2.mall.num,
							public_transpo_percent2		: ass.comparative2.public_transpo.num,
							improvement_percent2		: ass.comparative2.improvement.num,
							zoning_percent2				: ass.comparative2.zoning.num,
							computation_percent2		: ass.comparative2.computation.num2,

						username: sess.username,
						password: sess.password,
						remember: sess.remember,
						status: sess.status,
						email: sess.email,
						fname: sess.fname,
						lname: sess.lname,
						appnum: sess.appnum,
						can_accept: sess.can_accept
					});
				}
				else{//	IF REVIEWING NEW/UNASSIGNED ASSIGNMENTS (comment="New!")
				//Notes: Same layout as viewAssignment_0_admin.hbs, difference is no buttons at the bottom only.
					//console.log(ass.comparative1)
					//console.log(ass.comparative1.property_interest_percent)

					res.render('viewAssignment_1_admin.hbs', {
						ref_id 			: ass.ref_id,
						type_of_approach: ass.type_of_approach,
						client_f_name 	: ass.client_f_name,
						client_l_name 	: ass.client_l_name,
						lot_brgy		: ass.lot_brgy,
						lot_city		: ass.lot_city,
						lot_region		: ass.lot_region,
						zonal			: ass.zonal,
						assigned_to		: ass.assigned_to,

						//dates
						//ref_date		: ass.ref_date,
						created_at		: (ass.created_at.getMonth().toString())+" "+ass.created_at.getFullYear().toString(),
						completed_on	: ass.completed_on,
						expiring_on 	: ass.expiring_on,

			// SUPJECT PROPERTY
						price_per_sqm	: ass.price_per_sqm,
						lot_loc			: ass.lot_loc,
						property_type	: ass.property_type,
						property_interest: ass.property_interest,
						// property_images: [imageSchema],
						lot_size		: ass.lot_size,
						shape			: ass.shape,
						topo			: ass.topo,
						frontage		: ass.frontage,
						terms_of_sale	: ass.terms_of_sale,
						corner			: ass.corner,
						prime			: ass.prime,
						hospital		: ass.hospital,
						school			: ass.school,
						mall				: ass.mall,
						public_transpo	: ass.public_transpo,
						improvement		: ass.improvement,
						zoning			: ass.zoning,
						computation		: ass.computation,

						//comment
						comment: ass.comment,

			// COMPARATIVE I
							price_per_sqm1		: ass.comparative1.price_per_sqm,
							ref_date1			: ass.comparative1.ref_date.date, //idk if this works
							lot_loc1			: ass.comparative1.lot_loc,
							property_type1		: ass.comparative1.property_type.str,
							property_interest1	: ass.comparative1.property_interest.str,
							// property_images: [imageSchema],
							lot_size1			: ass.comparative1.lot_size.num1,
							shape1				: ass.comparative1.shape.str,
							topo1				: ass.comparative1.topo.str,
							frontage1			: ass.comparative1.frontage.str,
							terms_of_sale1		: ass.comparative1.terms_of_sale.str,
							corner1				: ass.comparative1.corner.bool,
							prime1				: ass.comparative1.prime.bool,
							hospital1			: ass.comparative1.hospital.bool,
							school1				: ass.comparative1.school.bool,
							mall1				: ass.comparative1.mall.bool,
							public_transpo1		: ass.comparative1.public_transpo.str,
							improvement1		: ass.comparative1.improvement.bool,
							zoning1				: ass.comparative1.zoning.str,
							computation1		: ass.comparative1.computation.num1,

				// COMPARATIVE I - percent1's
							ref_date_percent1			: ass.comparative1.ref_date.num,
							property_type_percent1		: ass.comparative1.property_type.num,
							property_interest_percent1	: ass.comparative1.property_interest.num,
							lot_size_percent1			: ass.comparative1.lot_size.num2,
							shape_percent1				: ass.comparative1.shape.num,
							topo_percent1				: ass.comparative1.topo.num,
							frontage_percent1			: ass.comparative1.frontage.num,
							terms_of_sale_percent1		: ass.comparative1.terms_of_sale.num,
							corner_percent1				: ass.comparative1.corner.num,
							prime_percent1				: ass.comparative1.prime.num,
							hospital_percent1			: ass.comparative1.hospital.num,
							school_percent1				: ass.comparative1.school.num,
							mall_percent1				: ass.comparative1.mall.num,
							public_transpo_percent1		: ass.comparative1.public_transpo.num,
							improvement_percent1		: ass.comparative1.improvement.num,
							zoning_percent1				: ass.comparative1.zoning.num,
							computation_percent1		: ass.comparative1.computation.num2,

				//	COMPARATIVE II
							price_per_sqm2		: ass.comparative2.price_per_sqm,
							ref_date2			: ass.comparative2.ref_date.date, //idk if this works
							lot_loc2			: ass.comparative2.lot_loc,
							property_type2		: ass.comparative2.property_type.str,
							property_interest2	: ass.comparative2.property_interest.str,
							// property_images: [imageSchema],
							lot_size2			: ass.comparative2.lot_size.num1,
							shape2				: ass.comparative2.shape.str,
							topo2				: ass.comparative2.topo.str,
							frontage2			: ass.comparative2.frontage.str,
							terms_of_sale2		: ass.comparative2.terms_of_sale.str,
							corner2				: ass.comparative2.corner.bool,
							prime2				: ass.comparative2.prime.bool,
							hospital2			: ass.comparative2.hospital.bool,
							school2				: ass.comparative2.school.bool,
							mall2				: ass.comparative2.mall.bool,
							public_transpo2		: ass.comparative2.public_transpo.str,
							improvement2		: ass.comparative2.improvement.bool,
							zoning2				: ass.comparative2.zoning.str,
							computation2		: ass.comparative2.computation.num1,

				// COMPARATIVE II - percent2's
							ref_date_percent2			: ass.comparative2.ref_date.num,
							property_type_percent2		: ass.comparative2.property_type.num,
							property_interest_percent2	: ass.comparative2.property_interest.num,
							lot_size_percent2			: ass.comparative2.lot_size.num2,
							shape_percent2				: ass.comparative2.shape.num,
							topo_percent2				: ass.comparative2.topo.num,
							frontage_percent2			: ass.comparative2.frontage.num,
							terms_of_sale_percent2		: ass.comparative2.terms_of_sale.num,
							corner_percent2				: ass.comparative2.corner.num,
							prime_percent2				: ass.comparative2.prime.num,
							hospital_percent2			: ass.comparative2.hospital.num,
							school_percent2				: ass.comparative2.school.num,
							mall_percent2				: ass.comparative2.mall.num,
							public_transpo_percent2		: ass.comparative2.public_transpo.num,
							improvement_percent2		: ass.comparative2.improvement.num,
							zoning_percent2				: ass.comparative2.zoning.num,
							computation_percent2		: ass.comparative2.computation.num2,

						username: sess.username,
						password: sess.password,
						remember: sess.remember,
						status: sess.status,
						email: sess.email,
						fname: sess.fname,
						lname: sess.lname,
						appnum: sess.appnum,
						can_accept: sess.can_accept
					});
				}
			}
			catch(err)
			{
				console.log(err)
			}
		}
		else		// IF AGENT IS LOGGED IN
			try{
				const ass = await Assignment.findOne({
					ref_id : req.params.ref_id
					})
				console.log(ass)
				
				//	in history
				if(ass.comment == "Approved."){
					res.render('history_0.hbs',{
							ref_id 			: ass.ref_id,
							type_of_approach: ass.type_of_approach,
							client_f_name 	: ass.client_f_name,
							client_l_name 	: ass.client_l_name,
							lot_brgy		: ass.lot_brgy,
							lot_city		: ass.lot_city,
							lot_region		: ass.lot_region,
							zonal			: ass.zonal,
							assigned_to		: ass.assigned_to,

							//dates
							ref_date		: ass.ref_date,
							created_at		: (ass.created_at.getMonth().toString())+" "+ass.created_at.getFullYear().toString(),
							completed_on	: ass.completed_on,
							expiring_on 	: ass.expiring_on,

				// SUPJECT PROPERTY
							price_per_sqm	: ass.price_per_sqm,
							lot_loc			: ass.lot_loc,
							property_type	: ass.property_type,
							property_interest: ass.property_interest,
							// property_images: [imageSchema],
							lot_size		: ass.lot_size,
							shape			: ass.shape,
							topo			: ass.topo,
							frontage		: ass.frontage,
							terms_of_sale	: ass.terms_of_sale,
							corner			: ass.corner,
							prime			: ass.prime,
							hospital		: ass.hospital,
							school			: ass.school,
							mall 				: ass.mall,
							public_transpo	: ass.public_transpo,
							improvement		: ass.improvement,
							zoning			: ass.zoning,
							computation		: ass.computation,

							//comment
							comment: ass.comment,

				// COMPARATIVE I
							price_per_sqm1		: ass.comparative1.price_per_sqm,
							ref_date1			: ass.comparative1.ref_date.date, //idk if this works
							lot_loc1			: ass.comparative1.lot_loc,
							property_type1		: ass.comparative1.property_type.str,
							property_interest1	: ass.comparative1.property_interest.str,
							// property_images: [imageSchema],
							lot_size1			: ass.comparative1.lot_size.num1,
							shape1				: ass.comparative1.shape.str,
							topo1				: ass.comparative1.topo.str,
							frontage1			: ass.comparative1.frontage.str,
							terms_of_sale1		: ass.comparative1.terms_of_sale.str,
							corner1				: ass.comparative1.corner.bool,
							prime1				: ass.comparative1.prime.bool,
							hospital1			: ass.comparative1.hospital.bool,
							school1				: ass.comparative1.school.bool,
							mall1				: ass.comparative1.mall.bool,
							public_transpo1		: ass.comparative1.public_transpo.str,
							improvement1		: ass.comparative1.improvement.bool,
							zoning1				: ass.comparative1.zoning.str,
							computation1		: ass.comparative1.computation.num1,

				// COMPARATIVE I - percent1's
							ref_date_percent1			: ass.comparative1.ref_date.num,
							property_type_percent1		: ass.comparative1.property_type.num,
							property_interest_percent1	: ass.comparative1.property_interest.num,
							lot_size_percent1			: ass.comparative1.lot_size.num2,
							shape_percent1				: ass.comparative1.shape.num,
							topo_percent1				: ass.comparative1.topo.num,
							frontage_percent1			: ass.comparative1.frontage.num,
							terms_of_sale_percent1		: ass.comparative1.terms_of_sale.num,
							corner_percent1				: ass.comparative1.corner.num,
							prime_percent1				: ass.comparative1.prime.num,
							hospital_percent1			: ass.comparative1.hospital.num,
							school_percent1				: ass.comparative1.school.num,
							mall_percent1				: ass.comparative1.mall.num,
							public_transpo_percent1		: ass.comparative1.public_transpo.num,
							improvement_percent1		: ass.comparative1.improvement.num,
							zoning_percent1				: ass.comparative1.zoning.num,
							computation_percent1		: ass.comparative1.computation.num2,

				//	COMPARATIVE II
							price_per_sqm2		: ass.comparative2.price_per_sqm,
							ref_date2			: ass.comparative2.ref_date.date, //idk if this works
							lot_loc2			: ass.comparative2.lot_loc,
							property_type2		: ass.comparative2.property_type.str,
							property_interest2	: ass.comparative2.property_interest.str,
							// property_images: [imageSchema],
							lot_size2			: ass.comparative2.lot_size.num1,
							shape2				: ass.comparative2.shape.str,
							topo2				: ass.comparative2.topo.str,
							frontage2			: ass.comparative2.frontage.str,
							terms_of_sale2		: ass.comparative2.terms_of_sale.str,
							corner2				: ass.comparative2.corner.bool,
							prime2				: ass.comparative2.prime.bool,
							hospital2			: ass.comparative2.hospital.bool,
							school2				: ass.comparative2.school.bool,
							mall2				: ass.comparative2.mall.bool,
							public_transpo2		: ass.comparative2.public_transpo.str,
							improvement2		: ass.comparative2.improvement.bool,
							zoning2				: ass.comparative2.zoning.str,
							computation2		: ass.comparative2.computation.num1,

				// COMPARATIVE II - percent2's
							ref_date_percent2			: ass.comparative2.ref_date.num,
							property_type_percent2		: ass.comparative2.property_type.num,
							property_interest_percent2	: ass.comparative2.property_interest.num,
							lot_size_percent2			: ass.comparative2.lot_size.num2,
							shape_percent2				: ass.comparative2.shape.num,
							topo_percent2				: ass.comparative2.topo.num,
							frontage_percent2			: ass.comparative2.frontage.num,
							terms_of_sale_percent2		: ass.comparative2.terms_of_sale.num,
							corner_percent2				: ass.comparative2.corner.num,
							prime_percent2				: ass.comparative2.prime.num,
							hospital_percent2			: ass.comparative2.hospital.num,
							school_percent2				: ass.comparative2.school.num,
							mall_percent2				: ass.comparative2.mall.num,
							public_transpo_percent2		: ass.comparative2.public_transpo.num,
							improvement_percent2		: ass.comparative2.improvement.num,
							zoning_percent2				: ass.comparative2.zoning.num,
							computation_percent2		: ass.comparative2.computation.num2,

							username: sess.username,
							password: sess.password,
							remember: sess.remember,
							status: sess.status,
							email: sess.email,
							fname: sess.fname,
							lname: sess.lname,
							appnum: sess.appnum,
							can_accept: sess.can_accept
						});
				}
				else{	//	in assignemnts (has save  details, compute, and send for process buttons)
					
					res.render('viewAssignment_0.hbs',{
							ref_id 			: ass.ref_id,
							type_of_approach: ass.type_of_approach,
							client_f_name 	: ass.client_f_name,
							client_l_name 	: ass.client_l_name,
							lot_brgy		: ass.lot_brgy,
							lot_city		: ass.lot_city,
							lot_region		: ass.lot_region,
							zonal			: ass.zonal,
							assigned_to		: ass.assigned_to,

							//dates
							ref_date		: ass.ref_date,
							created_at		: (ass.created_at.getMonth().toString())+" "+ass.created_at.getFullYear().toString(),
							completed_on	: ass.completed_on,
							expiring_on 	: ass.expiring_on,

				// SUPJECT PROPERTY
							price_per_sqm	: ass.price_per_sqm,
							lot_loc			: ass.lot_loc,
							property_type	: ass.property_type,
							property_interest: ass.property_interest,
							// property_images: [imageSchema],
							lot_size		: ass.lot_size,
							shape			: ass.shape,
							topo			: ass.topo,
							frontage		: ass.frontage,
							terms_of_sale	: ass.terms_of_sale,
							corner			: ass.corner,
							prime			: ass.prime,
							hospital		: ass.hospital,
							school			: ass.school,
							mall 				: ass.mall,
							public_transpo	: ass.public_transpo,
							improvement		: ass.improvement,
							zoning			: ass.zoning,
							computation		: ass.computation,

							//comment
							comment: ass.comment,

				// COMPARATIVE I
							price_per_sqm1		: ass.comparative1.price_per_sqm,
							ref_date1			: ass.comparative1.ref_date.date, //idk if this works
							lot_loc1			: ass.comparative1.lot_loc,
							property_type1		: ass.comparative1.property_type.str,
							property_interest1	: ass.comparative1.property_interest.str,
							// property_images: [imageSchema],
							lot_size1			: ass.comparative1.lot_size.num1,
							shape1				: ass.comparative1.shape.str,
							topo1				: ass.comparative1.topo.str,
							frontage1			: ass.comparative1.frontage.str,
							terms_of_sale1		: ass.comparative1.terms_of_sale.str,
							corner1				: ass.comparative1.corner.bool,
							prime1				: ass.comparative1.prime.bool,
							hospital1			: ass.comparative1.hospital.bool,
							school1				: ass.comparative1.school.bool,
							mall1				: ass.comparative1.mall.bool,
							public_transpo1		: ass.comparative1.public_transpo.str,
							improvement1		: ass.comparative1.improvement.bool,
							zoning1				: ass.comparative1.zoning.str,
							computation1		: ass.comparative1.computation.num1,

				// COMPARATIVE I - percent1's
							ref_date_percent1			: ass.comparative1.ref_date.num,
							property_type_percent1		: ass.comparative1.property_type.num,
							property_interest_percent1	: ass.comparative1.property_interest.num,
							lot_size_percent1			: ass.comparative1.lot_size.num2,
							shape_percent1				: ass.comparative1.shape.num,
							topo_percent1				: ass.comparative1.topo.num,
							frontage_percent1			: ass.comparative1.frontage.num,
							terms_of_sale_percent1		: ass.comparative1.terms_of_sale.num,
							corner_percent1				: ass.comparative1.corner.num,
							prime_percent1				: ass.comparative1.prime.num,
							hospital_percent1			: ass.comparative1.hospital.num,
							school_percent1				: ass.comparative1.school.num,
							mall_percent1				: ass.comparative1.mall.num,
							public_transpo_percent1		: ass.comparative1.public_transpo.num,
							improvement_percent1		: ass.comparative1.improvement.num,
							zoning_percent1				: ass.comparative1.zoning.num,
							computation_percent1		: ass.comparative1.computation.num2,

				//	COMPARATIVE II
							price_per_sqm2		: ass.comparative2.price_per_sqm,
							ref_date2			: ass.comparative2.ref_date.date, //idk if this works
							lot_loc2			: ass.comparative2.lot_loc,
							property_type2		: ass.comparative2.property_type.str,
							property_interest2	: ass.comparative2.property_interest.str,
							// property_images: [imageSchema],
							lot_size2			: ass.comparative2.lot_size.num1,
							shape2				: ass.comparative2.shape.str,
							topo2				: ass.comparative2.topo.str,
							frontage2			: ass.comparative2.frontage.str,
							terms_of_sale2		: ass.comparative2.terms_of_sale.str,
							corner2				: ass.comparative2.corner.bool,
							prime2				: ass.comparative2.prime.bool,
							hospital2			: ass.comparative2.hospital.bool,
							school2				: ass.comparative2.school.bool,
							mall2				: ass.comparative2.mall.bool,
							public_transpo2		: ass.comparative2.public_transpo.str,
							improvement2		: ass.comparative2.improvement.bool,
							zoning2				: ass.comparative2.zoning.str,
							computation2		: ass.comparative2.computation.num1,

				// COMPARATIVE II - percent2's
							ref_date_percent2			: ass.comparative2.ref_date.num,
							property_type_percent2		: ass.comparative2.property_type.num,
							property_interest_percent2	: ass.comparative2.property_interest.num,
							lot_size_percent2			: ass.comparative2.lot_size.num2,
							shape_percent2				: ass.comparative2.shape.num,
							topo_percent2				: ass.comparative2.topo.num,
							frontage_percent2			: ass.comparative2.frontage.num,
							terms_of_sale_percent2		: ass.comparative2.terms_of_sale.num,
							corner_percent2				: ass.comparative2.corner.num,
							prime_percent2				: ass.comparative2.prime.num,
							hospital_percent2			: ass.comparative2.hospital.num,
							school_percent2				: ass.comparative2.school.num,
							mall_percent2				: ass.comparative2.mall.num,
							public_transpo_percent2		: ass.comparative2.public_transpo.num,
							improvement_percent2		: ass.comparative2.improvement.num,
							zoning_percent2				: ass.comparative2.zoning.num,
							computation_percent2		: ass.comparative2.computation.num2,

							username: sess.username,
							password: sess.password,
							remember: sess.remember,
							status: sess.status,
							email: sess.email,
							fname: sess.fname,
							lname: sess.lname,
							appnum: sess.appnum,
							can_accept: sess.can_accept
						});
				}

			}
			catch(err)
			{
				console.log(err)
			}
	}
	else
	{
		res.redirect('/login-fail.html')
	}
});


// //THIS IS THE "PROPERTY" VIEW
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
			const ass = await Assignment.findOne({
				id : ref_id
				}).exec()

			console.log(ass)

			res.render('/viewAssignment_admin.hbs', {
				ref_id : id,
				client_f_name : ass.client_f_name,
				client_l_name : ass.client_l_name,
				lot_brgy : ass.lot_brgy,
				lot_city : ass.lot_city,
				lot_region : ass.lot_region,

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

			sess.currentAss = ref_id
		}
		else if (sess.username != "admin")
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

//this submits the comment and updates the assignment
app.get('/accept-assignment/:ref_id', async(req,res)=>{
	sess = req.session;
	console.log(req.params)
	if(sess.username)
	{
		try{
			// await Assignment.findOneAndUpdate({res: sess.username},{comment: true})
			// const ass = await Assignment.findOneAndUpdate({res: req.params.ref_id},{comment: "test"})
			// req.params.ref_id

			const ass = await Assignment.findOneAndUpdate(
				{ref_id: req.params.ref_id},{
					assigned_to: sess.username,
					comment: "The Assignment has been assigned to "+sess.username
				})
			const acct = await Account.findOneAndUpdate(
				{username: sess.username},{
					can_accept:  false
				})

			res.redirect('/view/0/'+req.params.ref_id)
		}
		catch(err){
			console.log(err)
		}
	}
	else{
		res.redirect('/login-fail.html')
	}
})


// The page that asks for the fields from admin is /admin-add-assignment
// THIS FUNCTION/PAGE SAVES NEW BLANK DOCUMENT FOR ASSIGNMENT
app.post('/submit-assignment', function(req,res) {
	sess = req.session

	var ref_id = req.body.ref_id
	try{
		Assignment.create(
		{
			ref_id: req.body.ref_id,
			type_of_approach: "Market Approach",
			client_f_name: req.body.client_f_name,
			client_l_name: req.body.client_l_name,
			client_contact_num: req.body.client_contact_num,
			client_email: req.body.client_email,
			lot_brgy: req.body.lot_brgy,
			lot_city: req.body.lot_city,
			lot_region: req.body.lot_region,
			assigned_to: "",
			zonal: req.body.zonal,
			price_per_sqm: 0,

			ref_date: 0,
			lot_loc: "",
			property_type: "",
			property_interest: "",
			// property_images: [imageSchema], //REPORT AS MISSING FEATURE NALANG, WE CAN'T IMPLEMENT THIS AT THIS TIME...
			lot_size: req.body.lot_size,
			shape: "",
			topo: "",
			frontage: "",
			terms_of_sale: "",
			corner: false,
			prime: false,
			hospital: false,
			school: false,
			mall:   false,
			public_transpo: "",
			improvement: false,
			zoning: "",
			computation: 0,
			//don't set comment because it has a default value that marks it as "New!"

			//add empty comparative
			comparative1 : {
				price_per_sqm: 0,
				ref_date: {date: 0, num: 0}, //idk if this works
				lot_loc: "",
				property_type: {str: "", num:0},
				property_interest: {str:"",num:0},
				//tut: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
				// property_images: [imageSchema],
				lot_size: {num1: 0, num2: 0},
				shape: {str: "", num:0},
				topo: {str: "", num:0},
				frontage: {str: "", num:0},
				terms_of_sale: {str: "", num:0},
				corner: {bool:0,num:0},
				prime: {bool:0,num:0},
				hospital: {bool:0,num:0},
				school: {bool:0,num:0},
				mall: {bool:0,num:0},
				public_transpo: {str:"", num:0},
				improvement: {bool:0,num:0},
				zoning: {str: "", num:0},
				computation: {num1: 0, num2: 0}
			},

			//add empty comparative
			comparative2 : {
				price_per_sqm: 0,
				ref_date: {date: 0, num: 0},
				lot_loc: "",
				property_type: {str: "", num:0},
				property_interest: {str:"",num:0},
				// property_images: [imageSchema],
				lot_size: {num1: 0, num2: 0},
				shape: {str: "", num:0},
				topo: {str: "", num:0},
				frontage: {str: "", num:0},
				terms_of_sale: {str: "", num:0},
				corner: {bool:0,num:0},
				prime: {bool:0,num:0},
				hospital: {bool:0,num:0},
				school: {bool:0,num:0},
				mall: {bool:0,num:0},
				public_transpo: {str: "", num:0},
				improvement: {bool:0,num:0},
				zoning: {str: "", num:0},
				computation: {num1: 0, num2: 0}
			}
		})
	}
	catch(err)
	{console.log(err)}

	res.redirect('/assignments')
});


app.get('/dashboard', async(req,res)=> {
	sess = req.session;
	if(sess.username){ //username exists
		if(sess.username=="admin")
		{
			res.render('dashboard.hbs', {
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
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
					remember: sess.remember,
					status: sess.status,
					email: sess.email,
					fname: sess.fname,
					lname: sess.lname,
					appnum: sess.appnum,
					can_accept: sess.can_accept,

					newnotif: assNum
					// deadlines:
				})
			}
			else{
				res.render('dashboard_unactivated.hbs', {
					username: sess.username,
					password: sess.password,
					remember: sess.remember,
					status: sess.status,
					email: sess.email,
					fname: sess.fname,
					lname: sess.lname,
					appnum: sess.appnum,
					can_accept: sess.can_accept
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
			password: sess.password,
			remember: sess.remember,
			status: sess.status,
			email: sess.email,
			fname: sess.fname,
			lname: sess.lname,
			appnum: sess.appnum,
			can_accept: sess.can_accept
        })
	}
	else{
		res.redirect('/login-fail.html')
		//if you're trying to access the profile page but you're not logged in
	}
});


app.get('/term-accept', async(req,res)=> {
	sess = req.session;
	console.log("in /term-accept")
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
	console.log("in /set-settings")
	if(sess.username){
		//update db
		try{
			//TODO: Check if username already being used!!
			
			//render with new data
			if (req.query.username!= sess.username && req.query.username != "")
			{
				await Account.findOneAndUpdate({username: sess.username},{username: req.query.username})
				sess.username = req.query.username
			}

			if(req.query.password != "" && req.query.retypepwd != "")	//if not blank both, means successful
			{
				await Account.findOneAndUpdate({username: sess.username},{password: req.query.password})
				sess.password = req.query.password
			}

			if(req.query.email != "" && sess.email != req.query.email)
			{
				await Account.findOneAndUpdate({username: sess.username},{email: req.query.email})
				sess.email = req.query.email
			}
			
			await Account.findOneAndUpdate({username: sess.username},{appnum: req.query.appnum})
			sess.appnum = req.query.appnum
			
			
			//res.redirect('/settings')
			res.render('settings.hbs', {
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				
				// username_comment: "",
				// password_comment: "",
				// retype_comment: sess.password,
				// remember_comment: sess.remember,
				// status_comment: sess.status,
				// email_comment: sess.email,
				// fname_comment: sess.fname,
				// lname_comment: sess.lname,
				// appnum_comment: ""
				//submit_comment: "SAVED SUCCESSFULLY."	//successfully saved
			})
			
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



app.get('/assignments', async(req,res)=> {
	sess = req.session;
	if(sess.username){
		if(sess.username=="admin")
		{ // IF ADMIN, UNASSIGNED ASSIGNMENTS and (ASSIGNED & UNFINISHED)
			const ass_new = await Assignment.find({
				assigned_to: "",
				comment: "New!"})	// comment "New!" means really new assignment
			// console.log(ass_new)
			const ass = await Assignment.find({
				assigned_to: {$ne: ""},//ASSIGNED TO SOMEONE
				comment: {$ne: "Approved."}})//that is not equal to Approved. (or it will go to history)

				res.render('assignments_admin.hbs', {
					assignment_new:ass_new,
					assignment_ass:ass,

					username: sess.username,
					password: sess.password,
					remember: sess.remember,
					status: sess.status,
					email: sess.email,
					fname: sess.fname,
					lname: sess.lname,
					appnum: sess.appnum,
					can_accept: sess.can_accept
				})
		}
		else{
			//IF AGENT, SHOW NEW ASSIGNMENTS FIRST, THEN ASSIGNED ASSIGNMENTS
			//ALSO CHECK IF can_accept BEFORE YOU PROCEED
			const ass_new = await Assignment.find({
				assigned_to: "",
				comment: "New!"})	// comment "New!" means really new assignment
			// console.log(ass_new)
			const ass = await Assignment.find({
				assigned_to: sess.username,//ASSIgned to you
				comment: {$ne: "Approved."}})//that is not equal to Approved. (or it will go to history)

			const howmany = await Assignment.countDocuments({
				assigned_to: sess.username,
				comment: {$ne: "Approved."}})

			console.log(sess)

			if (howmany==0)
			{
				sess.can_accept=true
			}
			else{
				sess.can_accept=false
			}

			if (sess.can_accept)
			{
				res.render('assignments.hbs', {
					how_many_ongoing : howmany,
					assignment_new:ass_new,
					assignment_ass:ass,

					username: sess.username,
					password: sess.password,
					remember: sess.remember,
					status: sess.status,
					email: sess.email,
					fname: sess.fname,
					lname: sess.lname,
					appnum: sess.appnum,
					can_accept: sess.can_accept

				})
			}
			else{
				res.render('assignments_cant_accept.hbs', {
					how_many_ongoing : howmany,
					assignment_new:ass_new,
					assignment_ass:ass,

					username: sess.username,
					password: sess.password,
					remember: sess.remember,
					status: sess.status,
					email: sess.email,
					fname: sess.fname,
					lname: sess.lname,
					appnum: sess.appnum,
					can_accept: sess.can_accept

				})
			}
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
			status: sess.status,
			email: sess.email,
			fname: sess.fname,
			lname: sess.lname,
			appnum: sess.appnum,
			can_accept: sess.can_accept
        })
	}
	else{
		res.redirect('/login-fail.html')
		//if you're trying to access the profile page but you're not logged in
	}
});

app.get('/terms', function(req,res){
	sess = req.session;
	if(sess.username){
		if (sess.status)
		{
			res.render('terms_active.hbs', {
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
				})
		}
		else{
			res.render('terms.hbs', {
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
			})
		}
	}
	else{
		res.redirect('/login-fail.html')
		//if you're trying to access the profile page but you're not logged in
	}
})

app.get('/save-ass', async(req,res)=> {
	// sess = req.session;
	// console.log(req.query.ref_id)
	console.log("in /save-ass")
	
	if(sess.username){
		var today = new Date()

		try{
			
			console.log(req.query)
			//console.log(req.params)
			// console.log(parseInt(req.query.price_per_sqm[0]))
			
			//So the thing is, just save everything on the screen, even if user put blank there, still save
			//the error checkng will be done in <script> of that page nalang so it's easier to seee
			await Assignment.findOneAndUpdate({ref_id: req.query.ref_id},{
				price_per_sqm: req.query.price_per_sqm[0],
				ref_date: req.query.ref_date[0],
				lot_loc: req.query.lot_loc[0],
				property_type: req.query.property_type[0],
				property_interest: req.query.property_interest[0],
				//tut: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
				//property_images: [imageSchema],
				lot_size: req.query.lot_size[0],
				shape: req.query.shape[0],
				topo: req.query.topo[0],
				frontage: req.query.frontage[0],
				terms_of_sale: req.query.terms_of_sale[0],
				corner: req.query.corner[0],
				prime: req.query.prime[0],
				hospital: req.query.hospital[0],
				school: req.query.school[0],
				mall: req.query.mall[0], //problem if left "mall" lol i cant be bothered anymore lmaoooo
				public_transpo: req.query.public_transpo[0],
				improvement: req.query.improvement[0],
				zoning: req.query.zoning[0],
				computation: req.query.computation[0],
				comparative1 : {
					price_per_sqm: req.query.price_per_sqm[1],
					ref_date: {
						date: req.query.ref_date[1],
						num: req.query.ref_date[2]
						},
					property_type: {
						str: req.query.property_type[1],
						num: req.query.property_type[2]
						},
					property_interest: {
						str: req.query.property_interest[1],
						num: req.query.property_interest[2]
						},
					lot_size: {
						num1: req.query.lot_size[1],
						num2: req.query.lot_size[2]
						},
					shape: {
						str: req.query.shape[1],
						num: req.query.shape[2]
						},
					topo: {
						str: req.query.topo[1],
						num: req.query.topo[2]
						},
					frontage: {
						str: req.query.frontage[1],
						num: req.query.frontage[2]
						},
					terms_of_sale: {
						str: req.query.terms_of_sale[1],
						num: req.query.terms_of_sale[2]
						},
					
					
					
					//hiding bools for now bc idk how to make them save :v
					// I saw this baka makahelp sa mag fifix:
					//		https://stackoverflow.com/questions/39962676/updating-mongodb-with-checkbox-information
					
					/*
					corner: {
						bool: req.query.corner[1],
						num: req.query.corner[2]
						},
					prime: {
						bool: req.query.prime[1],
						num: req.query.prime[2]
						},
					hospital: {
						bool: req.query.hospital[1],
						num: req.query.hospital[2]
						},
					school: {
						bool: req.query.school[1],
						num: req.query.school[2]
						},
					mall: {
						bool: req.query.mall[1],
						num: req.query.mall[2]
						},
					*/
					public_transpo: {
						str: req.query.public_transpo[1],
						num: req.query.public_transpo[2]
						},
						
					//also bool
					/*improvement: {
						bool: req.query.improvement[1],
						num: req.query.improvement[2]
						},
					*/
					
					//remove when boolis fixed, these are just placeholders
					corner: {
						bool: true,
						num: 0
						},
					prime: {
						bool: true,
						num: 0
						},
					hospital: {
						bool: true,
						num: 0
						},
					school: {
						bool: true,
						num: 0
						},
					mall: {
						bool: true,
						num: 0
						},
					improvement: {
						bool: true,
						num: 0
						},
						
						
					zoning: {
						str: req.query.zoning[1],
						num: req.query.zoning[2]
						},
					computation: {
						num1: req.query.computation[1],
						num2: req.query.computation[2]
					}
				},
				
				comparative2:{
					price_per_sqm: req.query.price_per_sqm[2],
					ref_date: {
						date: req.query.ref_date[3],
						num: req.query.ref_date[4]
						},
					property_type: {
						str: req.query.property_type[3],
						num: req.query.property_type[4]
						},
					property_interest: {
						str: req.query.property_interest[3],
						num: req.query.property_interest[4]
						},
					lot_size: {
						num1: req.query.lot_size[3],
						num2: req.query.lot_size[4]
						},
					shape: {
						str: req.query.shape[3],
						num: req.query.shape[4]
					},				
					topo: {
						str: req.query.topo[1],
						num: req.query.topo[2]
						},
					frontage: {
						str: req.query.frontage[1],
						num: req.query.frontage[2]
						},
					terms_of_sale: {
						str: req.query.terms_of_sale[1],
						num: req.query.terms_of_sale[2]
						},
					//placeholders
					public_transpo: {
						str: req.query.public_transpo[1],
						num: req.query.public_transpo[2]
						},
					
					
					
					
					//remove when boolis fixed, these are just placeholders
					corner: {
						bool: true,
						num: 0
						},
					prime: {
						bool: true,
						num: 0
						},
					hospital: {
						bool: true,
						num: 0
						},
					school: {
						bool: true,
						num: 0
						},
					mall: {
						bool: true,
						num: 0
						},
					improvement: {
						bool: true,
						num: 0
						},
						
						
						
					zoning: {
						str: req.query.zoning[1],
						num: req.query.zoning[2]
						},
					computation: {
						num1: req.query.computation[1],
						num2: req.query.computation[2]
					}
				}
			})
			
			//res.redirect('/assignments')
			res.redirect('/view/0/'+ req.query.ref_id)
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

app.post('/create-doc/:ref_id',async(req,res)=> {
	sess =  req.session
	
	console.log("/create-doc/"+req.query.ref_id)
	
	if (sess.username)
	{
		
		const ass = await Document.findOne({ref_id: req.query.ref_id})
		console.log(ass + " is ass")
		
		if (ass==null) { //it doesnt exist yet, create one
			try{
				Document.create({
					ref_id: req.query.ref_id,
					filename: "",
					company_name: "",
					company_address: "",
					appraiser_num: 0,
					appraiser_address: "",
					market_value: "",
					parcel_id: "",
					improvements: "",
					zoning_class: "",
					interest_appraised: "",

					//Start of Body of Document
					property_identification: "",
					appraisal_objective_property_rights: "",
					intended_use_intended_users: "",
					effective_date_report: "",
					statement_ownership_sales_history: "",
					scope_of_work: "",

					//property description
					title_no: "", 
					utilities: "",
					flood: "",
					easements: "",
					real_estate_taxes: "",
					zoning_desc: "",

					//area & neighborhood overview
					description_improvements: "",
					neighborhood: "",
					area_development: "",
					market_analysis: "",

					//valuation
					highest_best_use: "",
					legally_permissible: "",
					physical_possibility: "",
					financial_feasibility: "",
					maximum_productivity: "",
					conclusion: "",
					valuation_process: "",
					market_data_approach: "",
					explanation_adjustments: "",
					range_value_per_sqm: "",
					final_value_per_sqm: "",

					//reconciliation & final value opinion
					recon_final_value_opinion: "",
					market_value: "",
					market_value_per_sqm: "",
					cost_value: "",
					cost_value_per_sqm: "",
					income_value: "",
					income_value_per_sqm: "",
					final_value_indication: "",
					final_value_indication_per_sqm: ""
				})
			} catch(err){
				console.log(err)
			}
		}
		res.redirect('/edit-doc/'+req.query.ref_id);
	}
	else
	{
		res.redirect('/login-fail.html')
	}
})
//creates a new doc and goes to the page where you can input the docunent texts
app.get('/edit-doc/:ref_id', async(req,res)=> {
	sess = req.session
	
	console.log(req.params + " i s the ref_id")
	console.log("/edit-doc/"+req.params.ref_id)
	//check if document already exists
	
	if(sess.username)
	{
		// const docu = await Document.findOne({ref_id: req.params.ref_id}).exec();
		// console.log(docu+" is the docu")
		
		
		const docu = await Document.findOne({ref_id: req.params.ref_id});
		console.log(docu+" is the docu")
		try{
		
		
			res.render('edit_document.hbs', {
				ref_id : req.params.ref_id,
				
				/*
				filename: docu.filename,
				company_name: docu.filename,
				company_address: docu.company_address,
				appraiser_num: docu.appraiser_num,
				appraiser_address: docu.appraiser_address,
				market_value: docu.market_value,
				market_data_value: docu.market_data_value,
				parcel_id: docu.parcel_id,
				improvements: docu.improvements,
				zoning_class: docu.zoning_class,
				interest_appraised: docu.interest_appraised,

				// //Start of Body of Document
				// property_identification: "",
				// appraisal_objective_property_rights: "",
				// intended_use_intended_users: "",
				// effective_date_report: "",
				// statement_ownership_sales_history: "",
					// scope_of_work: "",

					// //property description
					// title_no: "", 
					// utilities: "",
					// flood: "",
					// easements: "",
					// real_estate_taxes: "",
					// zoning_desc: "",

					// //area & neighborhood overview
					// description_improvements: "",
					// neighborhood: "",
					// area_development: "",
					// market_analysis: "",

					// //valuation
					// highest_best_use: "",
					// legally_permissible: "",
					// physical_possibility: "",
					// financial_feasibility: "",
					// maximum_productivity: "",
					// conclusion: "",
					// valuation_process: "",
					// market_data_approach: "",
					// explanation_adjustments: "",
					// range_value_per_sqm: "",
					// final_value_per_sqm: "",

					// //reconciliation & final value opinion
					// recon_final_value_opinion: "",
					// market_value: "",
					// market_value_per_sqm: "",
					// cost_value: "",
					// cost_value_per_sqm: "",
					// income_value: "",
					// income_value_per_sqm: "",
					// final_value_indication: "",
					// final_value_indication_per_sqm: "",
				
				*/
					
				
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
			});
		} catch(err){
			console.log(err)
		}
		
	}
	else
	{
		res.redirect('/login-fail.html')
	}
})

app.get('/save-doc/:ref_id', async(req,res)=> {
	sess = req.session
	console.log("in /save-doc-"+req.params.ref_id)
	
	if(sess.username){
		//set completed on date as now
		var today = new Date()
		
		console.log(req.query)	//working

		// const ass = await Assignment.findOneAndUpdate(
			// {ref_id: req.params.ref_id},{
				// assigned_to: sess.username,
				// comment: "The Assignment has been assigned to "+sess.username
			// })

		const docu = await Document.findOne({ref_id: req.params.ref_id}).exec()
		console.log(docu)

		try{
			
			// const docu = await Document.find({ref_id: req.query}).exec()

			
			//So the thing is, just save everything on the screen, even if user put blank there, still save
			//the error checkng will be done in <script> of that page nalang so it's easier to seee
			// await Document.findOneAndUpdate({ref_id: req.query.ref_id},{
				// filename: req.query.filename,
				// company_name: req.query.company_name,
				// company_address: req.query.company_address,
				// appraisal_date: req.query.date,
				// appraiser_num: req.query.appraiser_num,
				// appraiser_address: req.query.appraiser_address,
				// market_value: req.query.market_value,
				// parcel_id: req.query.parcel_id,
				// improvements: req.query.improvements,
				// zoning_class: req.query.zoning_class,
				// interest_appraised: req.query.interest_appraised,
				
				// property_identification: req.query.property_identification,
				// appraisal_objective_property_rights: req.query.appraisal_objective_property_rights,
				// intended_use_intended_users: req.query.intended_use_intended_users,
				// effective_date_report: req.query.effective_date_report,
				// statement_ownership_sales_history: req.query.statement_ownership_sales_history,
				// scope_of_work: req.query.scope_of_work,
				
				// title_no: req.query.title_no, 
				// utilities: req.query.utilities,
				// flood: req.query.flood,
				// easements: req.query.easements,
				// real_estate_taxes: req.query.real_estate_taxes,
				// zoning_desc: req.query.zoning_desc,

				// description_improvements: req.query.description_improvements,
				// neighborhood: req.query.neighborhood,
				// area_development: req.query.area_development,
				// market_analysis: req.query.market_analysis,

				// highest_best_use: req.query.highest_best_use,
				// legally_permissible: req.query.legally_permissible,
				// physical_possibility: req.query.physical_possibility,
				// financial_feasibility: req.query.financial_feasibility,
				// maximum_productivity: req.query.maximum_productivity,
				// conclusion: req.query.conclusion,
				// valuation_process: req.query.valuation_process,
				// market_data_approach: req.query.market_data_approach,

				// explanation_adjustments: req.query.explanation_adjustments,
				// range_value_per_sqm: req.query.range_value_per_sqm,
				// final_value_per_sqm: req.query.final_value_per_sqm,

				// recon_final_value_opinion: req.query.recon_final_value_opinion,
				// market_value: req.query.market_value,
				// market_value_per_sqm: req.query.market_value_per_sqm,
				// cost_value: req.query.cost_value,
				// cost_value_per_sqm: req.query.cost_value_per_sqm,
				// income_value: req.query.income_value,
				// income_value_per_sqm: req.query.income_value_per_sqm,
				// final_value_indication: req.query.final_value_indication,
				// final_value_indication_per_sqm: req.query.final_value_indication_per_sqm,
			// })
			
			//res.redirect('/assignments')
			res.redirect('/edit-doc/'+req.params.ref_id)
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

app.get('/download-doc', async(req,res)=> {
	// sess = req.session;
	// console.log(req.query.ref_id)
	console.log(req.query)
	if(sess.username){
		try{
			res.render('download_document.hbs', {
				username: sess.username,
				password: sess.password,
				remember: sess.remember,
				status: sess.status,
				email: sess.email,
				fname: sess.fname,
				lname: sess.lname,
				appnum: sess.appnum,
				can_accept: sess.can_accept
			});
			//edit comment  to "Submitted."

			await Document.findOneAndUpdate(
				{ref_id: req.query.ref_id},
				{
					filename: req.query.filename,
					company_name: req.query.company_name,
					company_address: req.query.company_address,
					appraisal_date: req.query.date,
					appraiser_num: req.query.appraiser_num,
					appraiser_address: req.query.appraiser_address,
					market_value: req.query.market_value,
					parcel_id: req.query.parcel_id,
					improvements: req.query.improvements,
					zoning_class: req.query.zoning_class,
					interest_appraised: req.query.interest_appraised,
				
					property_identification: req.query.property_identification,
					//property_images: [imageSchema],
					appraisal_objective_property_rights: req.query.appraisal_objective_property_rights,
					intended_use_intended_users: req.query.intended_use_intended_users,
					effective_date_report: req.query.effective_date_report,
					statement_ownership_sales_history: req.query.statement_ownership_sales_history,
					scope_of_work: req.query.scope_of_work,
				
					title_no: req.query.title_no, 
					utilities: req.query.utilities,
					flood: req.query.flood,
					easements: req.query.easements,
					real_estate_taxes: req.query.real_estate_taxes,
					zoning_desc: req.query.zoning_desc,

					description_improvements: req.query.description_improvements,
					neighborhood: req.query.neighborhood,
					area_development: req.query.area_development,
					market_analysis: req.query.market_analysis,
	
					highest_best_use: req.query.highest_best_use,
					legally_permissible: req.query.legally_permissible,
					physical_possibility: req.query.physical_possibility,
					financial_feasibility: req.query.financial_feasibility,
					maximum_productivity: req.query.maximum_productivity,
					conclusion: req.query.conclusion,
					valuation_process: req.query.valuation_process,
					market_data_approach: req.query.market_data_approach,
					//comparables: ,
					explanation_adjustments: req.query.explanation_adjustments,
					range_value_per_sqm: req.query.range_value_per_sqm,
					final_value_per_sqm: req.query.final_value_per_sqm,

					recon_final_value_opinion: req.query.recon_final_value_opinion,
					market_value: req.query.market_value,
					market_value_per_sqm: req.query.market_value_per_sqm,
					cost_value: req.query.cost_value,
					cost_value_per_sqm: req.query.cost_value_per_sqm,
					income_value: req.query.income_value,
					income_value_per_sqm: req.query.income_value_per_sqm,
					final_value_indication: req.query.final_value_indication,
					final_value_indication_per_sqm: req.query.final_value_indication_per_sqm,
				})

			res.redirect('/editDocument'+ req.query.ref_id)
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


var server = app.listen(3000,function(){
});

app.get('/viewAssignment', function(req,res){
	res.redirect('/assignments')
});


/*		THIS IS THE PDF THING
https://www.geeksforgeeks.org/how-to-create-pdf-document-in-node-js/	*/
/*
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
*/