module.exports = {
	name: 'balance',
	alisases: ['bal', 'wallet', 'wal'],
	description: 'Checks the current $RAT wallet.',
	execute(message, args, profileData){
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		else
			return message.channel.send("Your current balance is: **" + profileData.rat + " $RAT**");
	}
};