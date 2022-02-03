const formatRat = require('../helper/formatRat.js');

module.exports = {
	name: 'balance',
	description: 'Checks the current $RAT wallet.',
	aliases: ['bal', 'wallet', 'wal'],
	execute(message, args, profileData){
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		else
			return message.channel.send("Your current balance is: **" + formatRat(profileData.rat) + " $RAT**");
	}
};