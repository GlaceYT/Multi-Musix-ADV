const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'wave',
  description: 'Wave at someone!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const waveGif = await anime.wave();

    const embed = new EmbedBuilder()
      .setColor('#00ffcc')
      .setDescription(`${sender} waves at ${targetUser || 'the air'}! 👋`)
      .setImage(waveGif);

    message.reply({ embeds: [embed] });
  },
};
