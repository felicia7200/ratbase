let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };

module.exports = {
	name: 'flip',
	description: 'Gamble away all your $RAT on the flip of a coin.',
	cooldown: 10,
	execute(message, args, profileData){
		
		//{ ERROR HANDLING
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		
		if(!args[0] || args[0].toLowerCase() === "help") {
			return message.channel.send(
				"Use this command to gamble $RAT on a coin flip.\n" + 
				"If you guess correctly, you win 2x your original bet.\n" + 
				"Syntax: **$$flip [amount to gamble] [heads or tails]**"
			);
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
			"Betting **" + args[0] + " $RAT** on **" + args[1].toUpperCase() +
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
						(+args[0] * 2) + " $RAT**!\nCong**RAT**ulations!"
					);
					
					profileData.rat += +args[0];
				} else {
					const face = (args[1].toLowerCase() === "heads") ? "Tails" : "Heads";
					
					message.channel.send(
						"**" + face + "**...\n" +
						"You lost **" + args[0] + " $RAT**, better luck next time."
					);
					
					profileData.rat -= +args[0];
				}
				profileData.save();
			}, 1000);
		}, 500);
	}
}