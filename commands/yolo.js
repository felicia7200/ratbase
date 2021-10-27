const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');

module.exports = {
	name: 'yolo',
	description: 'YOLO all your coin!',
	aliases: [],
	cooldown: 10,
	execute(message, args, profileData){
		// winChance = 1/x to win
		// winMultipler = full balance multipled by x for win
		// acceptPhrase = exact args needed for command to work
		
		const winChance = 7;
		const winMultiplier = 6;
		const acceptPhrase = "I am ready to lose my $RAT";
		let acceptArr = acceptPhrase.split(' ');
		
		if(!profileData)
			return message.channel.send("You do not have an account with RATBASE:tm:.");
		
		if(args[0] === "?" || args[0] === "help") {
			return message.channel.send(
				"Use this command to YOLO **ALL** of your **$$RAT**.\n" +
				`The odds of winning are 1/${winChance} and if you win your balance will be multiplied by ${winMultiplier}.\n` + 
				`In order to use the command you must use \n\`$$yolo ${acceptPhrase}\`\n`
			);
		}
		
		if(args.length != acceptArr.length){
			return message.channel.send(
				"Incorrect $$yolo arguments, seems like you aren't ready for this kind of risk.\n" +
				`Try \`$$yolo help\` and come back later.\n`
			);
		}
		
		for(let i = 0; i < acceptArr.length; i++){
			if(acceptArr[i].toLowerCase() !== args[i].toLowerCase()){
				return message.channel.send(
				"Incorrect $$yolo arguments, seems like you aren't ready for this kind of risk.\n" +
				`Try \`$$yolo help\` and come back later.\n`
			);
			}
		}
		
		const e = new MessageEmbed()
			.setColor(message.member.displayHexColor)
			.setTitle(message.member.displayName + ' is putting it all on the line! ');

		setTimeout(() => {
			message.channel.send({ embeds: [e] })
				.then((msg)=> {
				
				if(randomInt(0,winChance) == 0){
					const eEdit = new MessageEmbed()
						.setColor(message.member.displayHexColor)
						.setTitle(message.member.displayName + ' is putting it all on the line!')
						.setDescription('AND IS A WINNER!');
					
					profileData.rat *= winMultiplier;
					profileData.save();
					msg.edit({ embeds: [eEdit] }); 
					
					// print balance
					return message.channel.send("Your new balance is: **" + profileData.rat + " $RAT**");
				} else {
					const eEdit = new MessageEmbed()
						.setColor(message.member.displayHexColor)
						.setTitle(message.member.displayName + ' is putting it all on the line!')
						.setDescription('AND LOST IT ALL!');

					msg.edit({ embeds: [eEdit] });
					
					setTimeout(() => {
						let redistributed = false;
						let redistributeAmt = 0;
						let toDistribute = Math.floor(profileData.rat / 6);
						
						profileModel.find({}).sort({ rat: 1 }).exec((err, docs) => {
							if(docs[0]){
								message.channel.send(`${docs[0].user.split('#')[0]} is recieving ${toDistribute * 3} **$RAT** in redistributed wealth!`);
								docs[0].rat += toDistribute * 3;
								docs[0].save();
								
								if(docs[0].userID === profileData.userID) {
									redistributed = true;
									redistributeAmt = toDistribute * 3;
								}
							}
							if(docs[1]){
								message.channel.send(`${docs[1].user.split('#')[0]} is recieving ${toDistribute * 2} **$RAT** in redistributed wealth!`);
								docs[1].rat += toDistribute * 2;
								docs[1].save();
								
								if(docs[1].userID === profileData.userID) {
									redistributed = true;
									redistributeAmt = toDistribute * 2;
								}
							}
							if(docs[2]){
								message.channel.send(`${docs[2].user.split('#')[0]} is recieving ${toDistribute * 1} **$RAT** in redistributed wealth!`);
								docs[2].rat += toDistribute * 1;
								docs[2].save();
								
								if(docs[2].userID === profileData.userID) {
									redistributed = true;
									redistributeAmt = toDistribute * 1;
								}
							} 

						});
						setTimeout(() => {
							profileData.rat = (redistributed) ? redistributeAmt : 1;
							profileData.save();
						},250);
					},250);
					
				}					  
			});	   
		}, 500);	   
	}
};

let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };