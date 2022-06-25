//schema for viewAssignments
const mongoose =	require('mongoose')

const assignmentSchema = new mongoose.Schema({
	ref_id: String,
	type_of_approach: String,
	client_f_name: String,
	client_l_name: String,
	property_images: String,
	lot_size: String,
	trans_date: String,
	purchase_price: String,
	listing_price: String,
	terms_of_sale: String,
	location: String,
	corner: Boolean,
	shape: String,
	topo: String,
	area: Number,
	completed_on: Date,
	comment: String,
	assigned_to: String
	//created_at: { type: Date, required: true, default: Date.now }
	//expiring_at: created_at    : { type: Date, required: true, default: Date.now + 36)
})

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
