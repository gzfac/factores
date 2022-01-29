const Discord = require('discord.js');
const {prefix, token} = require('./config.json');
const com = new Discord.MessageEmbed()
const constantQueue = [];
const queue = new Map();
const cmd = require('./discord_modules/bot_commands');
const client = new Discord.Client();
//#region Discord

client.once('ready', () => {

    console.log("La hiperlus se aproxima..");

});

client.once('reconnecting', () => {

    console.log("No pierdas la fe, derrapante..");

});

client.once('disconnect', () => {

    console.log("La hiperlus sea contigo..");

});

client.on('message', async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.split(' ');
    const serverQueue = queue.get(message.guild.id);

    message.delete().then(msg => `Se borro el mensaje de: ${msg.author.username}`);

    if (message.content.startsWith(`${prefix}p`)) {

        cmd.execute(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}s`)) {

        cmd.skip(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}w`)) {

        cmd.stop(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}h`)) {

        cmd.help(message)
        return;

    } else if (message.content.startsWith(`${prefix}u`)){

        cmd.setupDefaultChannel(message)
        return;


    } else {

        message.channel.send("Tu comando fue dodgeado..");

    }

});

//#endregion

exports = com, constantQueue, queue;

client.login(token);