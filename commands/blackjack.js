const deckModel = require('../models/deckSchema.js');

// shuffle func modified from https://www.thatsoftwaredude.com/content/6196/coding-a-card-deck-in-javascript
let shuffle = (deck) => {
	for(let i = 0; i < 1000; i++) {
		let loc1 = Math.floor((Math.random() * deck.length));
		let loc2 = Math.floor((Math.random() * deck.length));
		let temp = deck[loc1];
		
		deck[loc1] = deck[loc2];
		deck[loc2] = temp;
	}
};

module.exports = {
	name: 'blackjack',
	description: 'Play a game of Blackjack and lose all of your $RAT.',
	aliases: ['bj', 'blackj', 'bjack', '21'],
	cooldown: 10,
	async execute(message, args, profileData){
		const gameName = "blackjack";
		
		//{ ERROR HANDLING
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		
		if(!args[0] || args[0].toLowerCase() === "help") {
			return message.channel.send(
				"Use this command to gamble $RAT on a game of Blackjack.\n" +
				"If you win, you get 2x your original bet. If you get 21, " +
				"then you win 3x your original bet.\n" +
				"Syntax: **$$blackjack [amount to gamble]**" +
				"Aliases: bj, blackj, bjack, 21"
			);
		}
		
		return message.channel.send("Under construction! Check back later!");
		// remove this return for testing
		
		let deckData;
		try { deckData = await deckModel.findOne({ userID: profileData.userID }); }
		catch (err) { console.log(err); }
		
		// if no deck exists
		if(!deckData) {
			let deck = deckModel.create({
				userID: profileData.userID,
				game: gameName
			});
			
			try { deckData = await deckModel.findOne({ userID: profileData.userID }); }
			catch (err) { console.log(err); }
			
			deckData.currDeck = shuffle(deckData.fullDeck);
			deckData.save();
			
			//// TODO: STORE TOP CARDS AND DEAL, POP FROM CURRDECK
		}
		
		// check for different game existing
		if(deckData && (deckData.game !== null || deckData.game !== gameName)) {
			return message.channel.send(
				"You are currently in the middle of another card game. " + 
				"Cannot start aa game of Blackjack."
			);
		}
		
		// check args[0] for hit/stand/double
		//// TODO: FILL IN
		if(deckData && deckData.game === gameName) {
			switch(args[0]) {
				case "hit":
					break;
				case "stand":
					break;
				default:
					return message.channel.send(
						"Incorrect argument.\nAcceptible arguments: " +
						"**hit, stand, double**"
					);
					break;
			}
		}
		
		//// TODO: FUNCTIONS FOR HANDLING WINS/LOSSES
	}
}