//schema for viewAssignments
const mongoose =	require('mongoose')

const assignmentSchema = new mongoose.Schema({
	ref_id: Number,
	type_of_approach: String,
	client_f_name: String,
	client_l_name: String,
	property_images: String,
	lot_size: Number,
	trans_date: Date,
	purchase_price: Number,
	listing_price: Number,
	terms_of_sale: String,
	loc_city: String,
	loc_region: String,
	loc_brgy: String,
	corner: Boolean,
	shape: String,
	topo: String,
	area: Number,
	completed_on: Date,
	comment: String,
	assigned_to: String,
	created_at: { type: Date, required: true, default: Date.now }
})

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
