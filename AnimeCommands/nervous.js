const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'nervous',
  description: 'Show that you\'re nervous!',
  async execute(message, args) {
    const sender = message.author;
    const nervousGif = await anime.nervous();

    const embed = new EmbedBuilder()
      .setColor('#cc9900')
      .setDescription(`${sender} is feeling nervous... 😰`)
      .setImage(nervousGif);

    message.reply({ embeds: [embed] });
  },
};
