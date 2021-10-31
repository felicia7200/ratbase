const profileModel = require('../models/profileSchema.js');

module.exports = {
	name: 'circulation',
	description: 'Check how much $RAT is in circulation',
	aliases: ['circ'],
	cooldown: 20,
	execute(message, args){
		let total = 0;		
		profileModel.find({}).exec((err, docs) => {	
		
			for(let i = 0; i < docs.length; i++) {
				total += docs[i].rat;
			}
			
			if(args[0] === "avg")
				return message.channel.send(
					"Average $RAT: " + Math.floor(total / docs.length) * 1.10
				);
			
			return message.channel.send(
				"There is currently **" + total + " $RAT** in circulation."
			);
		});
	}
};