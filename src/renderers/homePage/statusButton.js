const ipc = require('electron').ipcRenderer;

module.exports.loadStatusButton = button => {
    const statusButton = button;

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
