// import { Client, Collection } from 'discord.js';
// import { Client as Tatsumaki } from 'tatsumaki.js';
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const botFuncLib = require('./botFuncLib.js');
const botconfig = require('./jsonFiles/botconfig.json');

const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();

fs.readdir(path.join(__dirname, 'commands'), (err, files) => {
    if (err) console.log(err);

    const jsfile = files.filter(f => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach(f => {
        const props = require(`./commands/${f}`); // eslint-disable-line global-require, import/no-dynamic-require
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});

bot.on('ready', async () => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} server/s!`);
    bot.user.setActivity(`${botconfig.prefix}help`, { type: 'PLAYING' });
});

bot.on('message', async message => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    botFuncLib.checkRole(message);

    const prefix = botconfig.prefix;
    const messageArray = message.content.split(' ');
    const cmd = messageArray[0].slice(prefix.length);
    const args = messageArray.splice(1);

    const commandfile = bot.commands.get(cmd);
    if (commandfile) commandfile.run(bot, message, args);
});

bot.login(botconfig.discordToken);
