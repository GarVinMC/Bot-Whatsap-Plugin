const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');

// Fungsi untuk memuat plugin
const loadPlugins = () => {
    const plugins = {};
    const pluginPath = './plugins';

    if (!fs.existsSync(pluginPath)) fs.mkdirSync(pluginPath);

    fs.readdirSync(pluginPath).forEach(file => {
        if (file.endsWith('.js')) {
            const pluginName = file.replace('.js', '');
            plugins[pluginName] = require(path.join(pluginPath, file));
            console.log(`Plugin loaded: ${pluginName}`);
        }
    });

    return plugins;
};

// Fungsi utama bot
const startBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({
        auth: state,
    });

    // Ketika kode pairing ditemukan
    sock.ev.on('connection.update', (update) => {
        const { connection, pairingCode } = update;

        if (pairingCode) {
            console.log(`Kode pairing: ${pairingCode}`);
            console.log('Masukkan kode ini di perangkat WhatsApp Anda.');
        }

        if (connection === 'open') {
            console.log('Bot berhasil terhubung!');
        }

        if (connection === 'close') {
            console.log('Koneksi terputus. Mencoba menghubungkan ulang...');
            startBot();
        }
    });

    // Menyimpan kredensial
    sock.ev.on('creds.update', saveCreds);

    // Menangani pesan
    sock.ev.on('messages.upsert', async (m) => {
        const message = m.messages[0];
        if (!message.message) return;
        const text = message.message.conversation || message.message.extendedTextMessage?.text;

        console.log(`Pesan dari ${message.key.remoteJid}: ${text}`);
    });
};

// Menjalankan bot
startBot();
