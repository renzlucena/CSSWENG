const mongoose = require('mongoose')

const viewAssignment = require('./database/models/viewAssignment')

mongoose.connect('mongodb://localhost/assignment-db')

viewAssignment.create({
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