const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');
const formatRat = require('../helper/formatRat.js');

module.exports = {
	name: 'yolo',
	description: 'YOLO all your coin!',
	aliases: [],
	cooldown: 18000,
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
					return message.channel.send("Your new balance is: **" + formatRat(profileData.rat) + " $RAT**");
				} else {
					const eEdit = new MessageEmbed()
						.setColor(message.member.displayHexColor)
						.setTitle(message.member.displayName + ' is putting it all on the line!')
						.setDescription('AND LOST IT ALL!');

					msg.edit({ embeds: [eEdit] });
					
					setTimeout(() => {
						let redistributed = false;
						let redistributeAmt = 0;
						const toDistribute = Math.floor(profileData.rat / 6);
						const distributeAmts = [
							toDistribute * 3,
							toDistribute * 2,
							toDistribute,
						];
						
						profileModel.find({}).sort({ rat: 1 }).exec((err, docs) => {
							for(let i = 0; i < distributeAmts.length; i++) {
                                if(i == docs.length) break;
                                
								docs[i].rat += distributeAmts[i];
								docs[i].save();
								
								if(docs[i].userID === profileData.userID) {
									redistributed = true;
									redistributeAmt = distributeAmts[i];
								}
							}
							
                            if(docs.length > distributeAmts.length) {
                                message.channel.send(
                                    `${docs[0].user.split('#')[0]} is recieving ${formatRat(distributeAmts[0])} **$RAT** in redistributed wealth!\n` +
                                    `${docs[1].user.split('#')[0]} is recieving ${formatRat(distributeAmts[1])} **$RAT** in redistributed wealth!\n` +
                                    `${docs[2].user.split('#')[0]} is recieving ${formatRat(distributeAmts[2])} **$RAT** in redistributed wealth!`
                                );
                            } else {
                                let retMsg = "";
                                
                                for(let i = 0; i < docs.length; i++) {
                                    if(i == docs.length - 1) {
                                        retMsg += `${docs[i].user.split('#')[0]} is recieving ${formatRat(distributeAmts[i])} **$RAT** in redistributed wealth!`;
                                    } else {
                                        retMsg += `${docs[i].user.split('#')[0]} is recieving ${formatRat(distributeAmts[i])} **$RAT** in redistributed wealth!\n`;
                                    }
                                }
                                
                                message.channel.send(retMsg);
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