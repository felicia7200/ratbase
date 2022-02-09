const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
	user: { type: String, require: true, unique: true },
	userID: { type: String, require: true, unique: true },
	serverID: { type: String, require: true },
	rat: { type: Number, default: 0 },
    yolo: { type: Number, default: 6 },
    lastYolo: { type: Number, default: Math.floor(Date.now() / 86400000) }
});

module.exports = mongoose.model("Profile", profileSchema);