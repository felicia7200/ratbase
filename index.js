// Require the necessary discord.js classes
const Discord = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');

// require dotenv if not production build
const dotenv = (process.env.NODE_ENV !== 'prod') ? require('dotenv') : null;
if (dotenv !== null) dotenv.config();

// set token
const token = process.env.TOKEN || '';

// Create a new client instance
const client = new Discord.Client({ 
	presence: { activities: [{ name: 'hodling $RAT | $$help' }] },
	intents: [Discord.Intents.FLAGS.GUILDS, 
			  Discord.Intents.FLAGS.GUILD_MESSAGES],
	partials: ['MESSAGE']
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

['cmd_handler', 'ev_handler'].forEach((handler) => {
	require(`./handlers/${handler}`)(client, Discord);
});

mongoose.connect(process.env.SRV)
	.then(() => { console.log("Connected to RATBASE DB"); })
	.catch((err) => { console.log(err) });

// Login to Discord with your client's token
client.login(token);