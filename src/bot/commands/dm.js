module.exports.run = async (bot, message, args) => {
    if (args[0] && args[1]) {
        const user = message.guild.members.get(args[0]);
        console.log(user);
        console.log(message.mentions.users.get());
    }
};

module.exports.help = { name: 'dm' };
