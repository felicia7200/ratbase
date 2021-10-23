const mongoose = require('mongoose');

const suits = ["spades", "diamonds", "clubs", "hearts"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let makeCards = () => {
	let arr = [];
	
	for(let i = 0; i < suits.length; i++) {
		for(let j = 0; j < values.length; j++) {
			arr.push({value: values[j], suit: suits[i]});
		}
	}
	
	return arr;
};
const deck = makeCards();

const deckSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	fullDeck: { type: Array, require: true, default: deck },
	currDeck: { type: Array, require: true, default: deck },
	game: { type: String, require: true, default: null }
});

module.exports = mongoose.model("Deck", deckSchema);;