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

const numnum = new mongoose.Schema({
	num1: Number,
	num2: Number
},{ _id : false });

const strnum = new mongoose.Schema({
	str: String,
	num: Number
},{ _id : false });

const datenum = new mongoose.Schema({
	date: { type: Date, required: false, default: Date.now },
	num: Number
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
	corner: strnum,
	prime: strnum,
	hospital: strnum,
	school: strnum,
	mall: strnum,
	public_transpo: strnum,
	improvement: strnum,
	zoning: strnum,
	computation: numnum //range value per sqm is from lowest to highest comparable

},{ _id : false });

const assignmentSchema = new mongoose.Schema({
	ref_id: Number,
	type_of_approach: String,
	client_f_name: String,
	client_l_name: String,

	//will only be visible to admin
	client_contact_num: String,
	client_email: String,

	lot_brgy: String, //change to street or lot address; client address
	lot_city: String,
	lot_region: String,
	created_at: { type: Date, required: true, default: Date.now }, //appraisal date
	assigned_to: String,
	zonal: Number,
	title_no: String,

	//from here onwards the agents can edit the details na
	price_per_sqm: Number,
	ref_date: { type: Date, required: false, default: Date.now },
	lot_loc: String,
	property_type: String,
	property_interest: String, //interest appraised?
	//tut: https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
	property_images: [imageSchema],
	lot_size: Number,
	shape: String,
	topo: String,
	frontage: String,
	terms_of_sale: String,
	corner: String,
	prime: String,
	hospital: String,
	school: String,
	mall: String,
	public_transpo: String,
	improvement: String,
	zoning: String,
	computation: Number, //market value, divide by sqm to get final val per sqm, final val indication & final val indication per sqm

	completed_on: { type: Date, required: false, default: Date.now },
	expiring_on: { type: Date, required: false, default: Date.now },
	comparative1: comparativeSchema,
	comparative2: comparativeSchema,
	comment: {type:String, default:"New!"}
})

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
