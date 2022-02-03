const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');
const formatRat = require('../helper/formatRat.js');

module.exports = {
	name: 'leaderboard',
	description: 'Posts the top 5 highest $RAT hodlers.',
	aliases: ['scoreboard', 'leader', 'scores', 'lboard', 'sboard'],
	cooldown: 30,
	execute(message){
		profileModel.find({}).sort({ rat: -1 }).exec((err, docs) => {
			if(!docs)
				return message.channel.send(
					"There are currently no RATBASE:tm: accounts."
				);
			
			const embed = new MessageEmbed()
				.setColor('#0052FE')
				.setThumbnail('https://cdn.discordapp.com/attachments/420965765462753283/900974097754914826/ratio.png');
				
			if(docs.length >= 5) {
				embed.setTitle('Top 5 $RAT Hodlers')
					.addFields(
						{ name: `1. ${docs[0].user.split('#')[0]}`, value: `${formatRat(docs[0].rat)} $RAT` },
						{ name: `2. ${docs[1].user.split('#')[0]}`, value: `${formatRat(docs[1].rat)} $RAT` },
						{ name: `3. ${docs[2].user.split('#')[0]}`, value: `${formatRat(docs[2].rat)} $RAT` },
						{ name: `4. ${docs[3].user.split('#')[0]}`, value: `${formatRat(docs[3].rat)} $RAT` },
						{ name: `5. ${docs[4].user.split('#')[0]}`, value: `${formatRat(docs[4].rat)} $RAT` }
					);
			} else {
				embed.setTitle(`Top ${docs.length} $RAT Hodlers`);
				for(let i = 0; i < docs.length; i++) {
					embed.addField(`${i + 1}. ${docs[i].user.split('#')[0]}`, `${formatRat(docs[0].rat)} $RAT`);
				}
			}
				
			return message.channel.send({ embeds: [embed] });
		});
	}
};