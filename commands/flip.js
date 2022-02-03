const randomInt = require('../helper/randomInt.js');
const formatRat = require('../helper/formatRat.js');

module.exports = {
	name: 'flip',
	description: 'Gamble away all your $RAT on the flip of a coin.',
	aliases: [],
	cooldown: 4,
	execute(message, args, profileData){
		
		//{ ERROR HANDLING
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		
		if(!args[0] || args[0].toLowerCase() === "help") {
			return message.channel.send(
				"Use this command to gamble **$RAT** on a coin flip.\n" + 
				"If you guess correctly, you win 2x your original bet.\n" + 
				"Syntax: **$$flip [amount to gamble] [heads or tails]**\n\n" +
				"If you do not specify heads or tails, it will assume **heads**."
			);
		}
		
		if(!args[1]){
			message.channel.send(
				"Default bet is heads, since you didn't pick."
			);
			args[1] = "heads";
		}
		
		if(args.length > 2 || args.length < 2) {
			return message.channel.send(
				"Incorrect number of arguments. If you need help, please use **$$flip help**."
			);
		}
		
		if(args[0].indexOf('-') > -1) {
			return message.channel.send(
				"Cannot bet negative numbers. Bet is invalid."
			);
		}
		
		if(isNaN(+args[0])) {
			return message.channel.send(
				"Your bet not a number. Bet is invalid."
			);
		}
		
		if(+args[0] > profileData.rat) {
			return message.channel.send(
				"Your bet is higher than your current **$RAT** balance. Bet is invalid."
			);
		}
		
		if(args[1].toLowerCase() !== "heads" && args[1].toLowerCase() !== "tails") {
			return message.channel.send(
				"Invalid coin prediction. Please type simply \"heads\" or \"tails\" " + 
				"(without quotes)."
			);
		}
		//}
		
		message.channel.send(
			"Betting **" + formatRat(args[0]) + " $RAT** on **" + args[1].toUpperCase() +
			"**."
		);
		
		// make them wait for it lol
		setTimeout(() => {
			message.channel.send(
				"The result is..."
			);
			
			setTimeout(() => {
				const result = randomInt(0, 2);
				
				if((args[1].toLowerCase() === "heads" && result === 0) ||
				   (args[1].toLowerCase() === "tails" && result === 1)) {
					
					message.channel.send(
						"**" + args[1].toUpperCase() + "**! You win **" +
						formatRat((+args[0] * 2)) + " $RAT**!\nCong**RAT**ulations!\n" + 
						"Your new balance is **" + formatRat((profileData.rat += +args[0])) + " $RAT**!"
					);
					
					
				} else {
					const face = (args[1].toLowerCase() === "heads") ? "Tails" : "Heads";
					
					message.channel.send(
						"**" + face + "**...\n" +
						"You lost **" + formatRat(args[0]) + " $RAT**, better luck next time.\n" +
						"Your new balance is **" + formatRat((profileData.rat -= +args[0])) + " $RAT**!"
					);
					
					
				}
				profileData.save();
			}, 1000);
		}, 500);
	}
}