//schema for viewAssignments
const mongoose =	require('mongoose')

const accountSchema = new mongoose.Schema({
	acct_id: String,
	password: String,
	email: String,
	f_name: String,
	l_name: String
})

const account = mongoose.model('account', accountSchema);

module.exports = account;