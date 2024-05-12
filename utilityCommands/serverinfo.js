const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    aliases: ['server', 'sinfo'],
    description: 'Get information about server',
    execute(message, args) {
        // Check if a user was mentioned in the command, or use the message author as the default user
        
        const server = message.guild;
        const emojis = server.emojis.cache;
        const roles = server.roles.cache;
  
        // Create an embed object
        server.members.fetch(server.ownerId).then((owner) => {
        const embed = new EmbedBuilder()
        .setColor('#FFFFFF')
        .setTitle('📊 Server Info')
        .setThumbnail(server.iconURL({ format: 'png', dynamic: true, size: 1024 }))
        .setDescription(`
            **Server Name:** ${server.name}
            **Server ID:** ${server.id}
            **Owner:** ${owner.user.tag}
            **Created At:** ${server.createdAt.toUTCString()}
            **Members:** ${server.memberCount}
            **Emojis:** ${emojis.size} emojis
            **Roles:** ${roles.size} roles
        `)
        .setTimestamp();
    

        message.reply({ embeds: [embed] });
    }).catch((error) => {
    console.error('Error fetching server owner:', error);
    });
    }
}


/*

   MADE BY RTX!! FEEL FREE TO USE ANY PART OF CODE

  ██████╗░████████╗██╗░░██╗           
  ██╔══██╗╚══██╔══╝╚██╗██╔╝          
  ██████╔╝░░░██║░░░░╚███╔╝░          
  ██╔══██╗░░░██║░░░░██╔██╗░          
  ██║░░██║░░░██║░░░██╔╝╚██╗          
  ╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝          

   FOR EMOJIS EITHER YOU CAN EDIT OR JOIN OUR DISCORD SERVER 
   SO WE ADD BOT TO OUR SERVER SO YOU GET ANIMATED EMOJIS.

   DISCORD SERVER : https://discord.gg/FUEHs7RCqz
   YOUTUBE : https://www.youtube.com/channel/UCPbAvYWBgnYhliJa1BIrv0A

   FOR HELP CONTACT ME ON DISCORD
   ## Contact    [ DISCORD SERVER :  https://discord.gg/c4kaW2sSbm ]
*/