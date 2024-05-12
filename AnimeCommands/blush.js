const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'blush',
  description: 'Blush in embarrassment!',
  async execute(message, args) {
    const sender = message.author;
    const blushGif = await anime.blush();

    const embed = new EmbedBuilder()
      .setColor('#ff66b2')
      .setDescription(`${sender} is blushing... 💖`)
      .setImage(blushGif);

    message.reply({ embeds: [embed] });
  },
};
