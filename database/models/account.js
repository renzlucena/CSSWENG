//schema for viewAssignments
const mongoose =	require('mongoose')

const accountSchema = new mongoose.Schema({
	acct_id: String,
	username: String,
	password: String,
	status: Boolean,	//false- inactive     true-active
	email: String,
	fname: String,
	lname: String,
	appexp: Date,
	appnum: Number
})

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
