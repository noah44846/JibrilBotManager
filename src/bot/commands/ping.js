module.exports.run = async (bot, message) => {
    message.channel.send("pong! (Yes I'm still alive)");
};

module.exports.help = { name: 'ping' };
