const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const db = require("../mongodb");
module.exports = {
  name: 'dog',
  aliases: ['randomdog', 'woof'],
  description: 'Displays a random dog image',
  async execute(message, args) {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/image/random');
      const imageUrl = response.data.message;

      if (!imageUrl) {
        throw new Error('Failed to fetch dog image.');
      }

      const embed = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setTitle('Random Dog Image 🐶')
        .setImage(imageUrl);

      // Reply to the user who executed the command
      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching dog image:', error);
      // Reply to the user who executed the command
      message.reply('Sorry, I couldn\'t fetch a dog image at the moment.');
    }
  },
};

