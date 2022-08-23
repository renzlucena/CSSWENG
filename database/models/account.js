//schema for viewAssignments
const mongoose =	require('mongoose')

const accountSchema = new mongoose.Schema({
	username: String,
	password: String,
	remember: {type:Boolean, default:false},
	acc_id: Number,
	email: String,
	status: Boolean,	//false- inactive     true-active
	fname: String,
	lname: String,
	appnum: Number,
	appaddress: String,
	can_accept: {type:Boolean,default:true}
})

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
