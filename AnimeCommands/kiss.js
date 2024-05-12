const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'kiss',
  description: 'Send a virtual kiss!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const kissGif = await anime.kiss();

    const embed = new EmbedBuilder()
      .setColor('#ff3399')
      .setDescription(`${sender} sends a virtual kiss to ${targetUser || 'the air'}! 😘`)
      .setImage(kissGif);

    message.reply({ embeds: [embed] });
  },
};
