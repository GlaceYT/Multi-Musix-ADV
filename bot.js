const client = require("./main");
const { Riffy } = require("riffy");
const { EmbedBuilder } = require('discord.js');
const fs = require("fs");
const { Classic } = require("musicard");
const { prefix } = require('./config.json');
const nodes = [
     {
    host: "lavalink.oryzen.xyz",
    port: 80, 
    password: "oryzen.xyz", 
     secure: false
  },
];


client.riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4" 
});


client.on("ready", () => {
    client.riffy.init(client.user.id);
});


client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(1).trim().split(" ");
    const command = args.shift().toLowerCase();
  
    if (command === "play") {
        const query = args.join(" ");
        const player = client.riffy.createConnection({
            guildId: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            deaf: true 
        });
  
        const resolve = await client.riffy.resolve({ query: query, requester: message.author });
        const { loadType, tracks, playlistInfo } = resolve;
  
        if (loadType === 'playlist') {
            for (const track of resolve.tracks) {
                track.info.requester = message.author;
                player.queue.add(track);
            }
            const embed = new EmbedBuilder()
            .setAuthor({
                name: 'Added To Queue',
                iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157218651179597884/1213-verified.gif?ex=6517cf5a&is=65167dda&hm=cf7bc8fb4414cb412587ade0af285b77569d2568214d6baab8702ddeb6c38ad5&', 
                url: 'https://discord.gg/xQF9f9yUEM'
            })
                .setDescription(`**Playlist Name : **${playlistInfo.name} \n**Tracks : **${tracks.length}`)
                .setColor('#14bdff')
                .setFooter({ text: 'Use queue command for more Information' });
            message.reply({ embeds: [embed] });
            if (!player.playing && !player.paused) return player.play();
  
        } else if (loadType === 'search' || loadType === 'track') {
            const track = tracks.shift();
            track.info.requester = message.author;
            player.queue.add(track);

            const embed = new EmbedBuilder()
            .setAuthor({
                name: 'Added To Queue',
                iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157218651179597884/1213-verified.gif?ex=6517cf5a&is=65167dda&hm=cf7bc8fb4414cb412587ade0af285b77569d2568214d6baab8702ddeb6c38ad5&', 
                url: 'https://discord.gg/xQF9f9yUEM'
            })
                .setDescription(`**${track.info.title} **has been queued up and is ready to play!`)
                .setColor('#14bdff')
                .setFooter({ text: 'Use queue command for more Information' });
            message.reply({ embeds: [embed] });

            if (!player.playing && !player.paused) return player.play();
        } else {
            return message.channel.send('There are no results found.');
        }
    } else if (command === "loop") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
    
        const loopOption = args[0];
        if (!loopOption) return message.channel.send("Please provide a loop option: **queue**, **track**, or **none**.");
    
        if (loopOption === "queue" || loopOption === "track" || loopOption === "none") {
            player.setLoop(loopOption);
            message.channel.send(`Loop set to: ${loopOption}`);
        } else {
            message.channel.send("Invalid loop option. Please choose `queue`, `track`, or `none`.");
        }
    } else if (command === "pause") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
    
        player.pause(true);
        const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Playback Paused!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488720519049337/pause.png?ex=656b6a2e&is=6558f52e&hm=6695d8141e37330b5426f146ec6705243f497f95f08916a40c1db582c6e07d7e&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
        .setDescription('**Halt the beats! Music taking a break..**')
        .setColor('#2b71ec');

        message.reply({ embeds: [embed] });
    } else if (command === "resume") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
    
        player.pause(false);

        const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Playback Resumed!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488720762310757/play.png?ex=656b6a2e&is=6558f52e&hm=ae4f01060fe8ae93f062d6574ef064ca0f6b4cf40b172f1bd54d8d405809c7df&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
        .setDescription('**Back in action! Let the beats roll..**')
        .setColor('#2b71ec');
        message.reply({ embeds: [embed] });

    } else if (command === "seek") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
    
        const position = parseInt(args[0]);
        if (isNaN(position)) return message.channel.send("**Invalid position. Please provide a valid number of milliseconds.**");
    
        player.seek(position);
    } else if (command === "remove") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");

        const index = parseInt(args[0]);
        if (isNaN(index) || index < 1 || index > player.queue.size) {
            return message.channel.send(`Invalid index. Please provide a valid number between 1 and ${player.queue.size}.`);
        }

        const removedTrack = player.queue.remove(index - 1);

        if (!removedTrack) return message.channel.send("No track found at the specified index.");
        const embed = new EmbedBuilder()
        .setColor('#188dcc')
            .setAuthor({
                 name: 'Removed Sucessfully!',
                 iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236794583732457473/7828-verify-ak.gif?ex=6641dff7&is=66408e77&hm=e4d3f67ff76adbb3b7ee32fa57a24b7ae4c5acfe9380598e2f7e1a6c8ab6244c&',
                 url: 'https://discord.gg/xQF9f9yUEM'
               })
            .setDescription(`**Removed track:** ${removedTrack.info.title}`);  
            message.reply({ embeds: [embed] });

    } else if (command === "queue") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player || player.queue.size === 0) return message.channel.send("The queue is currently empty.");
    
        const queueList = player.queue.map((track, index) => `${index + 1}. ${track.info.title}`).join("\n");
        const chunks = queueList.match(/(.|\n){1,1999}/g);

        chunks.forEach(chunk => {
            const embed = new EmbedBuilder()
            .setColor('#2b71ec')
            .setAuthor({
                 name: 'Queue',
                 iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721001398333/queue.png?ex=656b6a2e&is=6558f52e&hm=7573613cbb8dcac83ba5d5fc55ca607cf535dd117b4492b1c918d619aa6fd7ad&',
                 url: 'https://discord.gg/xQF9f9yUEM'
               })
            .setDescription(chunk);  
            message.channel.send({ embeds: [embed] });
        });
    } else if (command === "skip") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
    
        player.stop();

        const embed = new EmbedBuilder()
           .setColor('#2b71ec')
        .setAuthor({
          name: 'Skipped Song!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721253052426/right-chevron-.png?ex=656b6a2e&is=6558f52e&hm=7a73aa51cb35f25eba52055c7b4a1b56bbf3a6d150643adc15b52dc533236956&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
          .setDescription('**Let\'s move on to the next beat...**');
        
        message.reply({ embeds: [embed] });
    } else if (command === "shuffle") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");

        player.queue.shuffle();
        const embed = new EmbedBuilder()
        .setColor('#188dcc')
        .setAuthor({
          name: 'Shuffled Queue!',
          iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236794583732457473/7828-verify-ak.gif?ex=6641dff7&is=66408e77&hm=e4d3f67ff76adbb3b7ee32fa57a24b7ae4c5acfe9380598e2f7e1a6c8ab6244c&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
          .setDescription('**Let\'s change the rhythm with a random selection!**');

        message.reply({ embeds: [embed] });
    } else if (command === "stop") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
    
        player.disconnect();

        const embed = new EmbedBuilder()
        .setColor('#2b71ec')
        .setAuthor({
          name: 'Player Stopped!',
          iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1230824519220985896/6280-2.gif?ex=6641e8a8&is=66409728&hm=149efc9db2a92eb90c70f0a6fb15618a5b912b528f6b1dcf1b517c77a72a733a&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
          .setDescription('**Bringing the music to a halt...**');
        message.reply({ embeds: [embed] });
    } else if (command === "clear") {
        const player = client.riffy.players.get(message.guild.id); 
        if (!player) return message.channel.send("No player available.");
        
        player.queue.clear();

        const embed = new EmbedBuilder()
        .setColor('#ffff00')
        .setAuthor({
          name: 'Queue Cleared!',
          iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1236802032938127470/4104-verify-yellow.gif?ex=6641e6e7&is=66409567&hm=25ecf140bc9c1f9492e9b7a0b573457fd498d744c28d56c5df663d7f84302083&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
          .setDescription('**Starting afresh, clearing out the queue..**');
        message.reply({ embeds: [embed] });
    }
});


client.riffy.on("nodeConnect", node => {
    console.log(`Node "${node.name}" connected.`)
});


client.riffy.on("nodeError", (node, error) => {
    console.log(`Node "${node.name}" encountered an error: ${error.message}.`)
});

client.riffy.on("trackStart", async (player, track) => {
    const musicard = await Classic({
        thumbnailImage: track.info.thumbnail,
        backgroundColor: "#070707",
        backgroundImage: "https://cdn.discordapp.com/attachments/1220001571228880917/1220001571690123284/01.png?ex=660d5a01&is=65fae501&hm=a8cfb44844e61aa0fd01767cd363af048df28966c30d7b04a59f27fa45cf69c4&",
        nameColor: "#FF7A00",
        progressColor: "#FF7A00",
        progressBarColor: "#5F2D00",
        progress: 50,
        name: track.info.title,
        author: `By ${track.info.author}`,
        authorColor: "#696969",
        startTime: "0:00",
        endTime: "4:00",
        timeColor: "#FF7A00"
    });

    fs.writeFileSync("musicard.png", musicard);
    const details = `**Title:** ${track.info.title}\n` +
    `**Author:** ${track.info.author}\n` +
    `**Seekable:** ${track.info.seekable}\n` +
    `**Stream:** ${track.info.stream}\n` +
    `**Requester:** ${track.info.requester}\n` +
    `**Source Name:** ${track.info.sourceName}`;

    const musicEmbed = new EmbedBuilder()
        .setColor("#FF7A00")

        .setAuthor({
            name: 'Currently playing a Track',
            iconURL: 'https://cdn.discordapp.com/attachments/1140841446228897932/1144671132948103208/giphy.gif', 
            url: 'https://discord.gg/xQF9f9yUEM'
          })
        .setDescription(details)
        .setImage("attachment://musicard.png");

    const channel = client.channels.cache.get(player.textChannel);
    channel.send({ embeds: [musicEmbed], files: ["musicard.png"] });
});


client.riffy.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    const autoplay = false;
    if (autoplay) {
        player.autoplay(player)
    } else {
        player.destroy();
        const embed = new EmbedBuilder()
        .setColor('#ffff00')
        .setAuthor({
          name: 'Queue Ended!',
          iconURL: 'https://cdn.discordapp.com/attachments/1230824451990622299/1230824519220985896/6280-2.gif?ex=6641e8a8&is=66409728&hm=149efc9db2a92eb90c70f0a6fb15618a5b912b528f6b1dcf1b517c77a72a733a&',
          url: 'https://discord.gg/xQF9f9yUEM'
        })
          .setDescription('**Bye Bye!, No more songs to play...**');
          channel.send({ embeds: [embed] });
      
    }
});


client.on("raw", (d) => {
    client.riffy.updateVoiceState(d);
});
