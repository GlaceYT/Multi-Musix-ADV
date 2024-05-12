const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'hug',
  description: 'Send a hug gif in an embedded message!',
  async execute(message, args) {
    
    const sender = message.author;

    
    const targetUser = message.mentions.users.first() || sender;

   
    const hugGif = await anime.hug();

 
    const embed = new EmbedBuilder()
      .setColor('#ff0000')
      .setDescription(`${sender} sends a hug to ${targetUser}!`)
      .setImage(hugGif);

    
    message.reply({ embeds: [embed] });
  },
};
