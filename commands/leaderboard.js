const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');

module.exports = {
	name: 'leaderboard',
	alisases: ['scoreboard', 'leader', 'scores', 'lboard', 'sboard'],
	cooldown: 30,
	description: 'Posts the top 5 highest $RAT hodlers.',
	execute(message, args){
		profileModel.find({}).sort({ rat: -1 }).exec((err, docs) => {			
			const embed = new MessageEmbed()
				.setColor('#0052FE')
				.setTitle('Top 5 $RAT Hodlers')
				.setThumbnail('https://cdn.discordapp.com/attachments/420965765462753283/900974097754914826/ratio.png')
				.addFields(
					{ name: `1. ${docs[0].user.split('#')[0]}`, value: `${docs[0].rat} $RAT` },
					{ name: `2. ${docs[1].user.split('#')[0]}`, value: `${docs[1].rat} $RAT` },
					{ name: `3. ${docs[2].user.split('#')[0]}`, value: `${docs[2].rat} $RAT` },
					{ name: `4. ${docs[3].user.split('#')[0]}`, value: `${docs[3].rat} $RAT` },
					{ name: `5. ${docs[4].user.split('#')[0]}`, value: `${docs[4].rat} $RAT` }
				);
				
			return message.channel.send({ embeds: [embed] });
		});
	}
};