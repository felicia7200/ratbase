const { MessageEmbed } = require('discord.js');
const profileModel = require('../models/profileSchema.js');

module.exports = {
	name: 'loserboard',
	description: 'Posts the top 5 worst $RAT hodlers.',
	aliases: ['losers', 'loser'],
	cooldown: 30,
	execute(message, args){
		profileModel.find({}).sort({ rat: -1 }).exec((err, docs) => {	let index = docs.length - 1;
			const embed = new MessageEmbed()
				.setColor('#0052FE')
				.setTitle('Worst 3 $RAT Hodlers')
				.setThumbnail('https://cdn.discordapp.com/attachments/420965765462753283/900974097754914826/ratio.png')
				.addFields(
					{ name: `1. ${docs[index].user.split('#')[0]}`, value: `${docs[index].rat} $RAT` },
					{ name: `2. ${docs[index-1].user.split('#')[0]}`, value: `${docs[index-1].rat} $RAT` },
					{ name: `3. ${docs[index-2].user.split('#')[0]}`, value: `${docs[index-2].rat} $RAT` }
				);                                         
			return message.channel.send({ embeds: [embed] });
		});
	}
};