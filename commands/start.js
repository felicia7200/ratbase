const profileModel = require('../models/profileSchema.js');
let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };

module.exports = {
	name: 'start',
	description: 'Starts a RATBASE:tm: account with a random number of RATCOINS',
	aliases: [],
	execute(message, args, profileData){
		// handle profile data creation
		if(!profileData) {
			profileModel.find({}).sort({ rat: 1 }).exec((err, docs) => {
				const defaultLow = 10;
				const defaultHigh = 1000;
				const highMulti = .5;
				
				const low = (docs && docs.length > 1 && docs[0].rat > defaultLow) ? Math.floor(docs[0].rat) : defaultLow;
				const high = (docs && docs.length > 1 && (docs[docs.length - 1] * highMulti) > defaultHigh) ? Math.floor(docs[docs.length - 1].rat * highMulti) : defaultHigh;
				
				const baseRat = randomInt(low, high + 1);
				
				// eslint-disable-next-line no-unused-vars
				let profile = profileModel.create({
					user: message.author.username + "#" + message.author.discriminator,
					userID: message.author.id,
					serverID: message.guild.id,
					rat: baseRat,
					bank: 0
				});
				
				return message.channel.send(
					"You now have a RATBASE:tm: account! Your current balance is: **" + baseRat + " $RAT**."
				);
			});
		} else {
			return message.channel.send(
				"You already have a RATBASE:tm: account!"
			);
		}
		
	}
}