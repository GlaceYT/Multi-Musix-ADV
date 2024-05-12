const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'dance',
  description: 'Dance like nobody\'s watching!',
  async execute(message, args) {
    const sender = message.author;
    const danceGif = await anime.dance();

    const embed = new EmbedBuilder()
      .setColor('#ffcc00')
      .setDescription(`${sender} is dancing! 💃🕺`)
      .setImage(danceGif);

    message.reply({ embeds: [embed] });
  },
};
