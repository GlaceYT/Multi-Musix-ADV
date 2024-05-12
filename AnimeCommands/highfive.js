const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'highfive',
  description: 'Give someone a virtual high five!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const highfiveGif = await anime.highfive();

    const embed = new EmbedBuilder()
      .setColor('#00ccff')
      .setDescription(`${sender} gives ${targetUser || 'the air'} a high five! 🖐`)
      .setImage(highfiveGif);

    message.reply({ embeds: [embed] });
  },
};
