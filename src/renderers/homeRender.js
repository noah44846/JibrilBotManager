const discord = require('discord.js');
const botconfig = require('../../botconfig.json');

const JibrilBot = new discord.Client({ disableEveryone: true });
const guildsMenu = document.getElementById('guilds_menu');

// create all the guild elements once the bot is "ready".
JibrilBot.on('ready', async () => {
    const guilds = JibrilBot.guilds;

    // loop through all the guilds the bot is on.
    guilds.forEach(guild => {
        // create a whole guild_element element with pic and name
        // <div class="guild_element">
        //     <a>
        //         <img src="pics/test.jpg" alt="hmmm">
        //         <h1>test</h1>
        //     </a>
        // </div>
        const newGuild = document.createElement('div');

        newGuild.classList.add('guild_element');
        guildsMenu.appendChild(newGuild);

        const guildLink = document.createElement('a');
        newGuild.appendChild(guildLink);

        const guildPic = document.createElement('img');
        guildPic.setAttribute('src', guild.iconURL);
        guildPic.setAttribute('alt', guild.name);
        guildLink.appendChild(guildPic);

        const guildName = document.createElement('h1');
        guildName.innerHTML = guild.name;
        guildLink.appendChild(guildName);
    });
});

JibrilBot.login(botconfig.discordToken);
