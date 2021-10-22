const profileModel = require('../models/profileSchema.js');
let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };

module.exports = {
	name: 'start',
	description: 'Starts a RATBASE:tm: account with a random number of RATCOINS',
	aliases: [],
	execute(message, args, profileData){
		// handle profile data creation
		if(!profileData) {
			const baseRat = randomInt(10, 1000);
			
			let profile = profileModel.create({
				user: message.author.username + "#" + message.author.discriminator,
				userID: message.author.id,
				serverID: message.guild.id,
				rat: baseRat,
				bank: 0
			});
			
			return message.channel.send(
				"You now have a RATBASE:tm: account! Your current balance is: " + baseRat
			);
		} else {
			return message.channel.send(
				"You already have a RATBASE:tm: account!"
			);
		}
		
	}
}