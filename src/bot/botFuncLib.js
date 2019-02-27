const Tatsumaki = require('tatsumaki.js');
const guildsInfos = require('./jsonFiles/guilds.json');
const botconfig = require('./jsonFiles/botconfig.json');

const tatsuClient = new Tatsumaki.Client(botconfig.tatsumakiKey);

// Checks if the author of the message has the correct role according to the authors amount
// of local tatsumaki XP if not the bot gives him the role and takes the old one away. The
// 'guilds.json' file specifies what role corresponds with what rank on every guild and how
// much XP you need to level up.
module.exports.checkRole = async message => {
    // Finds the roles to use for the authors guild.
    const guild = guildsInfos.guilds.find(e => e.id === message.guild.id);
    const roles = guild.roles;
    let resRole;
    let authorScore;

    // Gets the local tatsumaki XP of the author (logs an error if it fails).
    try {
        const guildRanking = await tatsuClient.guildLeaderboard(
            message.guild.id,
            message.guild.memberCount,
        );
        authorScore = guildRanking.find(e => e.user_id === message.member.id).score;
    } catch (err) {
        console.error(err);
    }

    // Gets a role out of the guilds roles array by multiplying the score by a level up factor
    // (which gives the index for the array).
    if (Math.floor(authorScore * guild.lvlUpFactor) < roles.lenght - 1) {
        resRole = message.guild.roles.find('name', roles[Math.floor(authorScore / 1000)]);
    } else {
        resRole = message.guild.roles.find('name', roles[roles.length - 1]);
    }

    // Checks if the role even exists, if the author already has it (in which case it does nothing
    // and if he doesn't already have it, the bot add the role) and if the author has any other
    // roles that he shouldn't have (should log error if anything goes wrong).
    if (resRole) {
        roles.forEach(r => {
            const currRole = message.guild.roles.find('name', r);
            if (currRole) {
                if (message.member.roles.has(currRole.id)) {
                    if (currRole !== resRole) {
                        message.member.removeRole(currRole).catch(console.error);
                    }
                } else if (currRole === resRole) {
                    message.member.addRole(resRole).catch(console.error);
                    message.channel.send(`<@${message.member.id}> leveled up to the **${resRole.name}** race!`);
                }
            } else {
                console.error(`Can't find the ${r} role. (There's probably something wrong in the guilds.json file.)`);
            }
        });
    } else {
        console.error('There\'s probably something wrong in the guilds.json file.');
    }
};
