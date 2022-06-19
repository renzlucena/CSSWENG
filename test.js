const mongoose = require('mongoose')

const Assignment = require('./database/models/assignment')
const Account = require('./database/models/account')

mongoose.connect('mongodb://localhost/appraisers-db')

Assignment.create({
	ref_id: 'String',
	type_of_approach: 'String',
	client_f_name: 'String',
	client_l_name: 'String',
	property_images: 'String',
	lot_size: 'String', 
	trans_date: 'String',
	purchase_price: 'String',
	listing_price: 'String'
}, (error,post) => 
{
	console.log(error,post)
})