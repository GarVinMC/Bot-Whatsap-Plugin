module.exports = (sock, message) => {
    const from = message.key.remoteJid;
    const text = message.message.conversation || message.message.extendedTextMessage?.text;

    if (text === '!hello') {
        sock.sendMessage(from, { text: 'Hello! Bot is active!' });
    }
};
