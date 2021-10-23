const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	user: { type: String, require: true, unique: true },
	userID: { type: String, require: true, unique: true },
	serverID: { type: String, require: true },
	rat: { type: Number, default: 0 },
	bank: { type: Number }
});

module.exports = mongoose.model("Profile", profileSchema);;