const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');

module.exports = {
	name: 'yolo',
	description: 'YOLO all your coin!',
	aliases: ['y', 'yo'],
	cooldown: 30,
	execute(message, args, profileData){
        const winChance = 7; //1 in this number chance to win
        const winMultiplier = 4;//multiplies balance by this when win
        
        const e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(message.member.displayName + ' is putting it all on the line!');
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
                    
                    //print balance
                    message.channel.send("Your new balance is: **" + profileData.rat + " $RAT**");
                } else {
                    const eEdit = new MessageEmbed()
                        .setColor(message.member.displayHexColor)
                        .setTitle(message.member.displayName + ' is putting it all on the line!')
                        .setDescription('AND LOST IT ALL!');

                    msg.edit({ embeds: [eEdit] });
                    
                    let toDistribute = Math.floor(profileData.rat / 6);
                    
                    
                    profileModel.find({}).sort({ rat: 1 }).exec((err, docs) => {
			             message.channel.send(`${docs[0].user.split('#')[0]} is recieving ${toDistribute * 3} **$RAT**`);
                        docs[0].rat += toDistribute * 3;
                        docs[0].save();
                        
                       message.channel.send(`${docs[1].user.split('#')[0]} is recieving ${toDistribute * 2} **$RAT**`);
                        docs[1].rat += toDistribute * 2;
                        docs[1].save();
                        
                        message.channel.send(`${docs[2].user.split('#')[0]} is recieving ${toDistribute * 1} **$RAT**`);
                       docs[2].rat += toDistribute * 1;
                       docs[2].save();
                    });
                    
                    profileData.rat = 1;
                    profileData.save();
                }
                        
            });
			
            
		}, 500);
	}
};

let randomInt = (min, max) => { return Math.floor(Math.random() * max) + min; };