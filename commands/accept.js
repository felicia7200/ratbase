const profileModel = require('../models/profileSchema.js');
const tradeModel = require('../models/tradeSchema.js');
const formatRat = require('../helper/formatRat.js');

module.exports = {
	name: 'accept',
	aliases: [],
	description: 'Accepts trades initiated by $$trade.',
	async execute(message, args, profileData) {
		const tradeID = args[0];
		
		let tradeData;
		try { tradeData = await tradeModel.findOne({ _id: tradeID }); } 
		catch (err) { console.log(err); }
		
		//{ ERROR HANDLING
		if(!tradeData) {
			return message.channel.send(
				"This trade does not exist. It has either expired, or never existed in the first place."
			);
		}
		
		if(tradeData.completed === true) {
			return message.channel.send(
				"Trade has already been completed."
			);
		}
		
		if(profileData.userID !== tradeData.user2) {
			return message.channel.send(
				"Only the user who was offered the trade can accept it."
			);
		}
		//}
		
		// get data of user1
		let otherData;
		try { otherData = await profileModel.findOne({ userID: tradeData.user1 }); } 
		catch (err) { console.log(err); }
		
		// in case a user loses enough that they can't go through with the trade
		if(((otherData.rat - tradeData.amt1) < 0) || ((profileData.rat - tradeData.amt2) < 0)) {
			return message.channel.send(
				"At least one participant in this trade has insufficient funds. The trade will not go through."
			);
		}
		
		otherData.rat = otherData.rat - tradeData.amt1 + tradeData.amt2;
		profileData.rat = profileData.rat - tradeData.amt2 + tradeData.amt1;
		
		otherData.save();
		profileData.save();
		
		tradeData.completed = true;
		tradeData.save();
		
		return message.channel.send(
			"Trade complete!\n" + 
			otherData.user + " now has a balance of **" + formatRat(otherData.rat) + " $RAT**.\n" +
			profileData.user + " now has a balance of **" + formatRat(profileData.rat) + " $RAT**."
		);
	}
};