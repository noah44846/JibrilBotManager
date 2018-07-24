const discord = require('discord.js');
const ipc = require('electron').ipcRenderer;
const botconfig = require('../bot/jsonFiles/botconfig.json');

const JibrilBot = new discord.Client({ disableEveryone: true });

const discordBotButton = () => {
    const statusButton = document.querySelector('#bot_status > header > button');

    statusButton.addEventListener('click', () => {
        if (statusButton.className === 'starting_up' || statusButton.className === 'online') {
            ipc.send('asynchronous-message', 'stop-bot');
        } else {
            ipc.send('asynchronous-message', 'start-bot');
        }
    });

    ipc.on('asynchronous-reply', (event, arg) => {
        if (arg === 'starting') {
            statusButton.className = 'starting_up';
            ipc.send('asynchronous-message', 'is-bot-on');
        } else if (arg === 'shutting-down') {
            statusButton.className = 'starting_up';
            ipc.send('asynchronous-message', 'is-bot-off');
        } else if (arg === 'bot-on') {
            statusButton.className = 'online';
        } else if (arg === 'bot-off') {
            statusButton.className = 'offline';
        }
    });
};

const updateGuildList = () => {
    const guildsMenu = document.getElementById('guilds_menu');
    const guilds = JibrilBot.guilds;
    const oldGuildLinks = [];

    // Check if there already are any guild Elements and if yes pushes them into an array.
    if (guildsMenu.childElementCount > 1) {
        Array.from(guildsMenu.children).forEach(e => {
            if (e.className === 'guild_element') {
                // This pushes the 2nd child node of the 'a' tag that is the 1st child node
                // of the 'guild_element' into the array.
                oldGuildLinks.push(e.childNodes[0].childNodes[1].innerHTML);
            }
        });
    }

    // loop through all the guilds the bot is on.
    guilds.forEach(guild => {
        // create a whole guild_element element with pic and name
        // <div class="guild_element">
        //     <a>
        //         <img src="pics/test.jpg" alt="hmmm">
        //         <h1>test</h1>
        //     </a>
        // </div>

        // Checks if guild element was not already made and if not creates it.
        if (!oldGuildLinks.includes(guild.name)) {
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
        }
    });
};

// create alle the guild elements once the bot is "ready".
JibrilBot.on('ready', async () => {
    updateGuildList();
    discordBotButton();
});

JibrilBot.login(botconfig.discordToken);
