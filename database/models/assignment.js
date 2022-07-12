//schema for viewAssignments
const mongoose =	require('mongoose')

const comparativeSchema = new mongoose.Schema({
	lot_size: Number,
	listing_price: Number,
	terms_of_sale: String,
	loc_city: String,
	loc_region: String,
	loc_brgy: String,
	corner: Boolean,
	school: Boolean,
	hospital: Boolean,
	mall: Boolean,
	shape: String,
	topo: String,
	area: Number
},{ _id : false });

const assignmentSchema = new mongoose.Schema({
	ref_id: Number,
	type_of_approach: String,
	client_f_name: String,
	client_l_name: String,
	loc_city: String,
	loc_region: String,
	loc_brgy: String,
	
	terms_of_sale: String,
	property_images: String,
	lot_size: Number,
	trans_date: Date,
	purchase_price: Number,
	listing_price: Number,
	corner: Boolean,
	school: Boolean,
	hospital: Boolean,
	mall: Boolean,
	shape: String,
	topo: String,
	area: Number,
	completed_on: Date,
	comment: String,
	assigned_to: String,
	comparative1: comparativeSchema,
	comparative2: comparativeSchema,
	created_at: { type: Date, required: true, default: Date.now }
})

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
