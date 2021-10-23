const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');

module.exports = {
	name: 'loserboard',
	description: 'Posts the top 3 worst $RAT hodlers.',
	aliases: ['losers', 'loser'],
	cooldown: 30,
	execute(message){
		profileModel.find({}).sort({ rat: 1 }).exec((err, docs) => {
			const embed = new MessageEmbed()
				.setColor('#0052FE')
				.setTitle('Worst 3 $RAT Hodlers')
				.setThumbnail('https://cdn.discordapp.com/attachments/420965765462753283/900974097754914826/ratio.png')
				.addFields(
					{ name: `1. ${docs[0].user.split('#')[0]}`, value: `${docs[0].rat} $RAT` },
					{ name: `2. ${docs[1].user.split('#')[0]}`, value: `${docs[1].rat} $RAT` },
					{ name: `3. ${docs[2].user.split('#')[0]}`, value: `${docs[2].rat} $RAT` }
				);										   
			return message.channel.send({ embeds: [embed] });
		});
	}
};