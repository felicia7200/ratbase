const fs = require('fs');

module.exports = (client, Discord) => {
	const loadDir = (dirs) => {
		const evFiles = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));
		
		for(const file of evFiles) {
			const ev = require(`../events/${dirs}/${file}`);
			const evName = file.split('.')[0];
			client.on(evName, (...args) => ev.execute(...args));
		}
	};
	['client'].forEach(e => loadDir(e));
};