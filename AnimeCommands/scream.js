const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'scream',
  description: 'Scream in fear or excitement!',
  async execute(message, args) {
    const sender = message.author;
    const screamGif = await anime.scream();

    const embed = new EmbedBuilder()
      .setColor('#ff3300')
      .setDescription(`${sender} is screaming... 😱`)
      .setImage(screamGif);

    message.reply({ embeds: [embed] });
  },
};
