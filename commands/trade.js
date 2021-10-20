const profileModel = require('../models/profileSchema.js');
const tradeModel = require('../models/tradeSchema.js');
const mongoose = require('mongoose');

module.exports = {
	name: 'trade',
	description: 'Trade $RAT with other users.',
	cooldown: 120,
	async execute(message, args, profileData){
		const otherID = (message.mentions.users.first()) ? message.mentions.users.first().id : -1;
		
		//{ ERROR HANDLING
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		
		if(!args[0] || args[0].toLowerCase() === "help") {
			return message.channel.send(
				"Use this command to trade $RAT with other users.\n" + 
				"Syntax: **$$trade @[user] [amount to send] [amount to receive]**"
			);
		}
		
		if(args.length > 3 || args.length < 3) {
			return message.channel.send(
				"Incorrect number of arguments. If you need help, please use **$$trade help**."
			);
		}
		
		if(args[1].indexOf('-') > -1 || args[2].indexOf('-') > -1) {
			return message.channel.send(
				"Cannot trade negative numbers."
			);
		}
		
		if(isNaN(+args[1]) || isNaN(+args[2])) {
			return message.channel.send(
				"At least one argument is not a number. Cannot complete trade."
			);
		}
		
		if(otherID === -1) {
			return message.channel.send(
				"Trade partner does not exist! Did you remember to use **@** to mention them?"
			);
		}
		//}
		
		let otherData;
		try { otherData = await profileModel.findOne({ userID: otherID }); } 
		catch (err) { console.log(err); }
		
		if(!otherData) {
			return message.channel.send(
				"Specified user does not have a RATBASE:tm: account."
			);
		} else {
			if(+args[1] > profileData.rat) {
				return message.channel.send(
					"You do not have sufficient funds to complete this trade."
				);
			}
			if(+args[2] > otherData.rat) {
				return message.channel.send(
					"Specified user does not have sufficient funds to complete this trade."
				);
			}
			
			let tradeID = mongoose.Types.ObjectId();
			let trade = tradeModel.create({
				_id: tradeID,
				user1: profileData.userID,
				user2: otherData.userID,
				amt1: +args[1],
				amt2: +args[2],
				completed: false
			});
			
			message.author.client.users.cache.get(otherID).send(
				"You have been offered: **" + args[1] + " $RAT** in exchange for **" + 
				args[2] + " $RAT** by " + profileData.user + ".\n" + 
				"This would bring your balance to: **" + 
				(+otherData.rat - +args[2] + +args[1]) + 
				" $RAT**, while bringing " + profileData.user + 
				"'s balance to: **" + (+profileData.rat - +args[1] + +args[2]) + 
				" $RAT**.\n" + "This offer expires in **3 minutes.**\n" + 
				"To accept this trade, respond with **" +
				"$$accept " + tradeID + "** in the server.\n" +
				"Here is the accept response again for easy copy-pasting: "
			);
			message.author.client.users.cache.get(otherID).send(
				"$$accept " + tradeID
			);
			
			return message.channel.send("Trade request sent.");
		}
	}
};