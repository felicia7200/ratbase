        
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'slots',
	alisases: ['s', 'slot'],
	description: 'Use a totally fake slot machine.',
    cooldown: 10,
	execute(message, args, profileData){
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
        
		let betAmount = 25;
        if(profileData.rat < betAmount)
			return message.channel.send("Your **$RAT** balance is not high enough to play slots");
        
        profileData.rat -= betAmount;
        let slotState = [5,5,5];
        // inside a command, event listener, etc.
        const e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(message.member.displayName + ' is playing slots!')
            .setDescription(''+slotStateToString(slotState));

        
        
        
        
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
				let prize = calculatePrize(betAmount, slotState);
                //calculate prize
                message.channel.send("You win **"+prize+" $RAT**!!!");
                profileData.rat += prize;
			}, 1250);
            profileData.save();
		}, 100);
        //uncomment to get max, min, mean slots prizes for the bet you put in
        //calculatePrizeStats(betAmount);
	}
    
};

const reelValues = [":skull:",":lemon:",":cherries:",":cheese:",":crown:",":rat:"];

let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };

//this is basically useless now but im lazy
function getIndexedReelVal(i){
    if(+i < 0) i = reelValues.length - 1;
    if(+i > reelValues.length - 1) i = 0;
    return reelValues[+i];
}

function slotStateToString(state){
    let slotString = " | " + getIndexedReelVal(state[0]) + " | " + getIndexedReelVal(state[1]) + " | " + getIndexedReelVal(state[2]) + " | ";
    return slotString;
}

function updateSlotState(state){
    for(let i = 0; i < 3; i++){
        state[i] = randomInt(0,reelValues.length);
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

function calculatePrize(bet, state){
    let prize = bet;
    let modifier = 1;
    if(state[0] == state[1] == state[2]){//triples pay out good
        modifier = state[0]; 
        return prize * modifier;
    }
    for(let i = 0; i < 3; i++){//prizes when its not triples
        switch (state[i]){
            case 0: //skull
                return 0;
                break;
            case 1: //lemon
                prize-=5;
                break;
            case 2: //cherries
                prize-=1;
                break;
            case 3: //cheese
                prize +=1;
                break;
            case 4://crown
                prize+=5;
                break;
            case 5: //rat
                modifier += 0.2;
                break;
        }
    }
    return prize * modifier;
}