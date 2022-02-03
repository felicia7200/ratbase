const profileModel = require('../models/profileSchema.js');
const randomInt = require('../helper/randomInt.js');
const formatRat = require('../helper/formatRat.js');

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
				
				let lowAvg = -1, totAvg = -1;
				
				// get averages if docs exists
				if(docs && docs.length >= 5) {
					const lowAvgAmt = 3;
					lowAvg = 0;
					totAvg = 0;
					
					for(let i = 0; i < docs.length; i++) {
						totAvg += docs[i].rat;
						
						if(i < lowAvgAmt) {
							lowAvg += docs[i].rat;
						}
					}
					
					totAvg /= docs.length;
					lowAvg /= lowAvgAmt;
				}
				
				const low = (lowAvg > 0 && lowAvg > defaultLow) ? Math.floor(lowAvg) : defaultLow;
				const high = (totAvg > 0 && totAvg > defaultHigh) ? Math.floor(totAvg) : defaultLow;
				
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
					"You now have a RATBASE:tm: account! Your current balance is: **" + formatRat(baseRat) + " $RAT**."
				);
			});
		} else {
			return message.channel.send(
				"You already have a RATBASE:tm: account!"
			);
		}
		
	}
}