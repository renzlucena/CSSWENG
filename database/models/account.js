//schema for viewAssignments
const mongoose =	require('mongoose')

const accountSchema = new mongoose.Schema({
	acct_id: String,
	username: String,
	password: String,
	status: 0,	//0- inactive, need to activate! 1-active, 2-active, but on vacation. Cannot accept new assignemnts
	email: String,
	fname: String,
	lname: String,
	appexp: Date,
	appnum: Number
})

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
