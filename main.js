

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Player } = require('discord-player');
const express = require('express');
require('dotenv').config();


const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => {
    return GatewayIntentBits[a];
  }),
});
const { printWatermark } = require('./functions/handlers');
const configPath = './config.json';
const configData = JSON.parse(fs.readFileSync(configPath));
const prefix = configData.prefix;


const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const imagePath = path.join(__dirname, 'index.html');
  res.sendFile(imagePath);
});
app.listen(port, () => {
  console.log(`🔗 Listening to GlaceYT : http://localhost:${port}`);
});
printWatermark();

client.commands = new Map();

const funCommandsPath = path.join(__dirname, 'funCommands');
const animeCommandsPath = path.join(__dirname, 'AnimeCommands');
const utilityCommandsPath = path.join(__dirname, 'utilityCommands');
const imageCommandsPath = path.join(__dirname, 'imageCommands');
const basicCommandsPath = path.join(__dirname, 'basicCommands');

const animeCommandFiles = fs.readdirSync(animeCommandsPath).filter((file) => file.endsWith('.js'));
const funCommandFiles = fs.readdirSync(funCommandsPath).filter((file) => file.endsWith('.js'));
const utilityCommandFiles = fs.readdirSync(utilityCommandsPath).filter((file) => file.endsWith('.js'));
const imageCommandFiles = fs.readdirSync(imageCommandsPath).filter((file) => file.endsWith('.js'));
const basicCommandFiles = fs.readdirSync(basicCommandsPath).filter((file) => file.endsWith('.js'));

for (const file of funCommandFiles) {
  const command = require(path.join(funCommandsPath, file));
  client.commands.set(command.name, command);
}

for (const file of animeCommandFiles) {
  const command = require(path.join(animeCommandsPath, file));
  client.commands.set(command.name, command);
}
for (const file of utilityCommandFiles) {
  const command = require(path.join(utilityCommandsPath, file));
  client.commands.set(command.name, command);
}

for (const file of imageCommandFiles) {
  const command = require(path.join(imageCommandsPath, file));
  client.commands.set(command.name, command);
}

for (const file of basicCommandFiles) {
  const command = require(path.join(basicCommandsPath, file));
  client.commands.set(command.name, command);
}

client.on('messageCreate', (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);  
  } catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
  }
});



async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log('\x1b[32m%s\x1b[0m', '|    🍔 Bot logged in successfully!');
    console.log('\x1b[36m%s\x1b[0m', '|    🚀 Commands Loaded successfully!');
    console.log('\x1b[32m%s\x1b[0m', `|    🌼 Logged in as ${client.user.username}`);
    console.log('\x1b[36m%s\x1b[0m', `|    🏡 Bot is in ${client.guilds.cache.size} servers`);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to log in:', error);
    console.log('\x1b[31m%s\x1b[0m', '❌ Client Not Login, Restarting Process...');
    process.kill(1);
  }
}


client.once('ready', () => {
  setTimeout(() => {
    console.log('\x1b[32m%s\x1b[0m', `|    🎯 Activity sucessfully set!`);
    client.user.setPresence({
      activities: [{ name: `v@1.7`, type: ActivityType.Watching }],
      status: 'idle',
    });
  }, 2000); 
});


login();


setInterval(() => {
  if (!client || !client.user) {
    console.log('\x1b[31m%s\x1b[0m', '❌ Client Not Logged in, Restarting Process...');
    process.kill(1);
  }
}, 15000);

module.exports = client;


