module.exports = {
	name: 'test',
	description: 'Message tester',
	aliases: [],
	execute(message){
		
		//   is a 1em space
		let spaces = "    ";
		
		// edit the message 
		let wait = (msg, tmp) => {
			setTimeout(() => {
				msg.edit(":coin:" + tmp + ":rat:");
			}, 10);
		};
		
		message.channel.send(":skull: __**TRIPLE SKULLS**__ :skull:");
		message.channel.send(
			":coin:" + spaces + ":rat:"
		).then((msg) => {
			for(let i = 1; i < spaces.length; i++) {
				let numSpaces = spaces.length - i;
				let tempSpaces = spaces.slice(0, numSpaces);
				wait(msg, tempSpaces);
			}
			
			// give the rat half a second to think about his actions
			setTimeout(() => {
				msg.edit(":smiling_imp: :rat:");
				
				// give the user some time to process what happened
				setTimeout(() => {
					return msg.channel.send(
						"Oh no! A devious little rat creature has taken half of your **$RAT**!\n" +
						"Your balance is now: **" + 0 + " $RAT**."
					);
				}, 500);
			}, 500);
		});
	}
};