const db = require("../mongodb");
module.exports = {
  name: 'say',
  description: 'Make the bot repeat a message and delete the user message',
  async execute(message, args) {
   
    if (args.length === 0) {
      message.reply('Please provide a message to repeat.');
      return;
    }

  
    const messageToRepeat = args.join(' ');

    
    try {
      await message.delete();
    } catch (error) {
      console.error(`Error deleting user message: ${error}`);
    }

 
    message.channel.send(messageToRepeat);
  },
};
