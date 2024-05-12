const db = require("../mongodb");
module.exports = {
  name: 'roll',
  aliases: ['dice', 'rolldice'],
  description: 'Rolls a dice',
  execute(message, args) {
    const sides = parseInt(args[0]) || 6; // Default to 6 sides if no argument provided
    const result = Math.floor(Math.random() * sides) + 1;

    // Reply to the user with the dice roll result
    message.reply(`You rolled a ${result} on a ${sides}-sided dice!`);
  },
};
