const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const db = require("../mongodb");
module.exports = {
  name: 'joke',
  description: 'Tells a random joke',
  async execute(message, args) {
    try {
      const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const { setup, punchline } = response.data;

      const embed = new EmbedBuilder()
        .setColor('#FFC0CB')
        .setTitle('Random Joke')
        .setDescription(`${setup}\n\n${punchline}`);

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching joke:', error);
      message.reply('Sorry, I couldn\'t tell a joke at the moment.');
    }
  },
};
