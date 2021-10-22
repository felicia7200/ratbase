const profileModel = require('../../models/profileSchema.js');

const dotenv = (process.env.NODE_ENV !== 'prod') ? require('dotenv') : null;
if (dotenv !== null) dotenv.config();

const cooldowns = new Map();
const noArgCmds = ['balance', 'leaderboard', 'start', 'tax'];

module.exports = { 
	name: 'messageCreate',
	description: 'Activates a command upon receiving a message',
	async execute(message) {
		const prefix = process.env.PREFIX || "$$";
		const client = message.author.client;
		
		if(!message.content.startsWith(prefix) || message.author.bot) return;
		
		// check if profiledata already exists
		let profileData;
		try { profileData = await profileModel.findOne({ userID: message.author.id }); } 
		catch (err) { console.log(err); }
		
		const args = message.content
			.slice(prefix.length)
			.trim()
			.split(/ +/g);
		const cmd = args.shift().toLowerCase();
		const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
		
		// check for cooldown and apply that if necessary
		if(command && command.cooldown && !args.includes("help") && (args[0] != null || noArgCmds.includes(command.name))) {
			if(!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Map());
			}
			
			const currTime = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmt = (command.cooldown) * 1000;
			
			// print out how much time if left on cooldown
			if(timestamps.get(message.author.id)) {
				const expTime = timestamps.get(message.author.id) + cooldownAmt;
				
				if(currTime < expTime) {
					const timeLeft = (expTime - currTime) / 1000;
					
					return message.channel.send(`Please wait ${timeLeft.toFixed(1)} more seconds before using ${command.name} again.`);
				}
			}
			
			// updates current time in the timestamps map
			timestamps.set(message.author.id, currTime);
		}
		
		// update username/discriminator if necessary
		if(profileData && (profileData.user.indexOf(message.author.username) < 0 || profileData.user.indexOf(message.author.discriminator) < 0)) {
			profileData.user = message.author.username + "#"+ message.author.discriminator;
			profileData.save();
		}
		
		if(command) command.execute(message, args, profileData);
		else return message.channel.send("This command does not exist!");
	}
}