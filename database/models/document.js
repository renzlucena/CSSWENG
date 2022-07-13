//schema for viewAssignments
const mongoose =	require('mongoose')

const imageSchema = new mongoose.Schema({
	name: String,
	desc: String,
	img:{
		data: Buffer,
		contentType: String
	}
},{ _id : false });

const boolnum = new mongoose.Schema({
	bool: Boolean,
	num: Number,
},{ _id : false });

const numnum = new mongoose.Schema({
	num1: Number,
	num2: Number,
},{ _id : false });

const strnum = new mongoose.Schema({
	str: String,
	num: Number,
},{ _id : false });

const datenum = new mongoose.Schema({
	date: { type: Date, required: false, default: Date.now },
	num: Number,
},{ _id : false });

const comparativeSchema = new mongoose.Schema({
	price_per_sqm: Number,
	ref_date: datenum, //ref_date & ref_date_percent
	lot_loc: String,
	property_type: strnum,
	property_interest: strnum,
	//tut: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
	property_images: [imageSchema],
	lot_size: numnum,
	shape: strnum,
	topo: strnum,
	frontage: strnum,
	terms_of_sale: strnum,
	corner: boolnum,
	prime: boolnum,
	hospital: boolnum,
	school: boolnum,
	public_transpo: strnum,
	improvement: boolnum,
	zoning: strnum,
	computation: numnum

},{ _id : false });

const assignmentSchema = new mongoose.Schema({
	ref_id: Number,
	type_of_approach: String,
	client_f_name: String,
	client_l_name: String,
	client_contact_num: String,
	client_email: String,
	lot_brgy: String,
	lot_city: String,
	lot_region: String,
	created_at: { type: Date, required: true, default: Date.now },
	assigned_to: String,
	zonal: Number,
	price_per_sqm: Number,
	ref_date: { type: Date, required: false, default: Date.now },
	lot_loc: String,
	property_type: String,
	property_interest: String,
	//tut: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
	property_images: [imageSchema],
	lot_size: Number,
	shape: String,
	topo: String,
	frontage: String,
	terms_of_sale: String,
	corner: Boolean,
	prime: Boolean,
	hospital: Boolean,
	school: Boolean,
	public_transpo: String,
	improvement: Boolean,
	zoning: String,
	computation: numnum,

	completed_on: { type: Date, required: false, default: Date.now },
	expiring_on: { type: Date, required: false, default: Date.now },
	comparative1: comparativeSchema,
	comparative2: comparativeSchema,
	comment: {type:String, default:"New!"}
})

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
