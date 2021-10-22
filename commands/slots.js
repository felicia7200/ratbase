const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'slots',
	description: 'Use a totally fake slot machine.',
	aliases: ['s', 'slot'],
    cooldown: 10,
	execute(message, args, profileData){
		const betAmount = (+args[0] > 0) ? +args[0] : 25;
		
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");

        if(profileData.rat < betAmount)
			return message.channel.send("Your **$RAT** balance is not high enough to play slots.");
		
		if(args[0] === "?" || args[0] === "help") {
			return message.channel.send(
				"Use this command to gamble **$$RAT** on a slot machine.\n" +
				"Syntax: **$$slots [amount to gamble]**\n" + 
				"Aliases: s, slot\n\n" + 
				"If you do not specify an amount, it will assume **25 $RAT**."
			);
		}
        
        profileData.rat -= betAmount;
		
		// default slot state is triple skull
        let slotState = [0, 0, 0];
		
        // inside a command, event listener, etc.
        const e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(message.member.displayName + ' is playing slots!')
            .setDescription('' + slotStateToString(slotState));

		message.channel.send("Betting **" + betAmount + " $RAT** on the slots...");

        // make them wait for it lol
		setTimeout(() => {
			message.channel.send({ embeds: [e] })
				.then((msg)=> {
				for(let i = 0; i < 4; i++){ //number of slot updates to do
					slotState = updateSlotState(slotState); //update the slots
						const eEdit = new MessageEmbed()
							.setColor(message.member.displayHexColor)
							.setTitle(message.member.displayName + ' is playing slots!')
							.setDescription(''+slotStateToString(slotState));
							
						msg.edit({ embeds: [eEdit] });
				}              
            });
			setTimeout(() => {
				const prize = calculatePrize(betAmount, slotState, profileData);
                profileData.rat += prize;
                profileData.save();
				
				if(prize >= 0) {
					return message.channel.send(
						"You win **" + prize + " $RAT**!\n" + 
						"Your new balance is **" + profileData.rat + " $RAT**!"
					);
				} else {
					deviousRat(message, profileData);
				}
			}, 1250);
            
		}, 100);
        //uncomment to get max, min, mean slots prizes for the bet you put in
        //calculatePrizeStats(betAmount);
        
	}
    
};

const reelValues = [":skull:",":lemon:",":cherries:",":cheese:",":crown:",":rat:"];

let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };

//this is basically useless now but im lazy
function getIndexedReelVal(i){
    if(i < 0) i = reelValues.length - 1;
    if(i > reelValues.length - 1) i = 0;
    return reelValues[i];
}

function slotStateToString(state){
    let slotString = " | " + getIndexedReelVal(+state[0]) + " | " + getIndexedReelVal(+state[1]) + " | " + getIndexedReelVal(+state[2]) + " | ";
    return slotString;
}

function updateSlotState(state){
    for(let i = 0; i < state.length; i++){
        state[i] = randomInt(0, reelValues.length);
    }
    return state;
}

function calculatePrizeStats(bet){
    let max = 0;
    let min = 99999;
    let mean = 0;
    let count = 0;
    let sum = 0;
    for(let i = 0; i< 6;i++){
        for(let j = 0; j< 6;j++){
            for(let k = 0; k< 6;k++){
                count++;
                let temp = calculatePrize(bet,[i,j,k]);
                if(temp>max) max = temp;
                if(temp<min) min = temp;
                sum += temp;
            }
        }
    }
    mean = sum/count;
    console.log("max: "+max);
    console.log("min: "+min);
    console.log("mean: "+mean);
}

function calculatePrize(bet, state, pd){
	const betAmt = bet;
    let prize = bet;
    let modifier = 1;
	
	// if triple, big modifier
    if((state[0] == state[1]) && (state[1] == state[2])){
		// if triple skulls steal money from player
		if(state[0] == 0) {
			return (pd.rat / 2) * -1;
		} else {
			modifier = (state[0] != 1) ? state[0] : 1.5; 
			return prize * modifier;
		}
    }
    for(let i = 0; i < state.length; i++){//prizes when its not triples
		
		// break out of loop if skull is rolled
        if(state[i] == 0) {
			// skull debug
			//console.log(`${pd.user} has SKULL at pos ${i}`);
			prize = 0;
			break;
		}
		
		switch (state[i]){
            case 0: //skull
                prize = 0;
                break;
            case 1: //lemon
                prize -= betAmt * 0.04;
                break;
            case 2: //cherries
                prize -= betAmt * 0.02;
                break;
            case 3: //cheese
                prize += betAmt * 0.14;
                break;
            case 4://crown
                prize += betAmt * 0.26;
                break;
            case 5: //rat
                modifier += 0.3;
                break;
			default: // shouldn't happen, but if it does then we know there's something wrong
				prize = -444.4444444444;
				break;
        }
    }
	
	// again for skull debug
	//console.log('---------');
	
    return Math.ceil(prize * modifier);
}

let deviousRat = (message, pd) => {
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
					"Your balance is now: **" + pd.rat + " $RAT**."
				);
			}, 500);
		}, 500);
	});
}