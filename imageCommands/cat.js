const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const db = require("../mongodb");
module.exports = {
  name: 'cat',
  aliases: ['randomcat', 'meow'],
  description: 'Displays a random cat image',
  async execute(message, args) {
    try {
      const response = await axios.get('https://api.thecatapi.com/v1/images/search');
      const imageUrl = response.data[0]?.url;

      if (!imageUrl) {
        throw new Error('Failed to fetch cat image.');
      }

      const embed = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setTitle('Random Cat Image 😺')
        .setImage(imageUrl);

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching cat image:', error);
      message.reply('Sorry, I couldn\'t fetch a cat image at the moment.');
    }
  },
};

