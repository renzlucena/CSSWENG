//schema for viewAssignments
const mongoose =	require('mongoose')

const accountSchema = new mongoose.Schema({
	username: String,
	password: String,
	remember: {type:Boolean, default:false},
	status: Boolean,	//false- inactive     true-active
	email: String,
	fname: String,
	lname: String,
	appnum: Number,
	can_accept: {type:Boolean,default:true}
})

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
