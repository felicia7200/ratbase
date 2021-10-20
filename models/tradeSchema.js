const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
	user1: { type: String, require: true },
	user2: { type: String, require: true },
	amt1: { type: Number, require: true },
	amt2: { type: Number, require: true },
	completed: { type: Boolean, default: false, require: true },
	expireAt: { type: Date, default: Date.now, expires: '180' }
});

module.exports = model = mongoose.model("Trade", tradeSchema);;