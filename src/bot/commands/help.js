const Discord = require('discord.js');
const botconfig = require('../jsonFiles/botconfig.json');

module.exports.run = async (bot, message) => {
    const helpEmbed = new Discord.RichEmbed()
        .setTitle('TestBot help')
        .setDescription(`
**${botconfig.prefix}dm** <target user mention> <message to send> : dm a member of the same guild.
**${botconfig.prefix}ping** : pong
**${botconfig.prefix}help** : Woah man real meta shit right there!
        `)
        .setColor('#bababa');

    message.channel.send(helpEmbed);
};
module.exports.help = { name: 'help' };
