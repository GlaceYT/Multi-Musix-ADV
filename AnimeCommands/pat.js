const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'pat',
  description: 'Pat a user with a pat gif!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first() || sender;
    const patGif = await anime.pat();

    const embed = new EmbedBuilder()
      .setColor('#00ff00')
      .setDescription(`${sender} pats ${targetUser}!`)
      .setImage(patGif);

    message.reply({ embeds: [embed] });
  },
};
