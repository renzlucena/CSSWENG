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
	listing_price: String
})

const viewAssignment = mongoose.model('viewAssignment', assignmentSchema);

module.exports = viewAssignment;