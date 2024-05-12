const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'bonk',
  description: 'Bonk someone on the head!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const bonkGif = await anime.bonk();

    const embed = new EmbedBuilder()
      .setColor('#ff3366')
      .setDescription(`${sender} bonks ${targetUser || 'the air'} on the head! 🤦‍♂️`)
      .setImage(bonkGif);

    message.reply({ embeds: [embed] });
  },
};
