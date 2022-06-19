//schema for viewAssignments
const mongoose =	require('mongoose')

const accountSchema = new mongoose.Schema({
	acct_id: String,
	password: String,
	email: String,
	fname: String,
	lname: String,
	appexp: Date,
	appnum: Number
})

const account = mongoose.model('account', accountSchema);

module.exports = account;