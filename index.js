const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const ytdl = require('ytdl-core');
const YTAPI = require('./ytapi.js')

const client = new Discord.Client();

const queue = new Map();

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

    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}p`)) {

        execute(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}s`)) {

        skip(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}w`)) {

        stop(message, serverQueue);
        return;


    } else if (message.content.startsWith(`${prefix}h`)) {

        help(message)
        return;

    } else {

        message.channel.send("Tu comando fue dodgeado..");

    }

});

async function execute(message, serverQueue) {



    let video = await YTAPI.retornarVideo(message);

    const args = video.url;

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {

        return message.channel.send("Metete a un canal de voz forro");

    }

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {

        return message.channel.send("Dame permisos sorete");

    }

    const songInfo = await ytdl.getInfo(args);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    }

    if (!serverQueue) {

        const queueContruct = {

            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true

        }

        queue.set(message.guild.id, queueContruct)

        queueContruct.songs.push(song);

        try {

            var connection = await voiceChannel.join();
            queueContruct.connection = connection;

            play(message.guild, queueContruct.songs[0])

        } catch (e) {

            console.log(e);
            queue.delete(message.guild.id);
            return message.channel.send(e);

        }

    } else {

        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} ya viene, no seas bobi`);

    }

}

function play(guild, song) {

    const serverQueue = queue.get(guild.id);

    if (!song) {

        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;

    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {

        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);

    }).on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Arrancandungui: ${song.title}`);

}

function skip(message, serverQueue) {

    if (!message.member.voice.channel) {

        return message.channel.send("Entra al canal pa skipear..");

    }

    if (!serverQueue) {

        return message.channel.send("No se esta reproduciendo nada tontin..")

    }

    serverQueue.connection.dispatcher.end();

}

function stop(message, serverQueue) {

    if (!message.member.voice.channel) {

        return message.channel.send("Metete al canal para stopear bobina..")

    }

    if (!serverQueue) {

        return message.channel.send("No hay musica lastre..")

    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();

}

function mensaje(video) {
    const embed = new Discord.MessageEmbed()
        .setTitle('Sonando....')
        .setColor('#34eb86')
        .addField('Titulo', video.titulo)
        .addField('Url', video.url)
        .setThumbnail(video.thumbnail);
    message.channel.send(embed);
}

function help(message) {

    const embed = new Discord.MessageEmbed()
        .setTitle('\:snowflake: Factores -> Lista de comandos')
        .setColor('#34eb86')
        .addField('Agregar cancion a la cola: ', '!p <URL>', false)
        .addField('Saltearse una cancion: ', '!s', false)
        .addField('Desconectarse: ', '!w', false)
        .setAuthor('derrapante de hiperlus', 'https://cdn.discordapp.com/avatars/483947449891815459/79fe719bce37b660825d7d51688fd87f.webp?size=80', 'https://github.com/gzfac')
        .setDescription('Factores, es un bot musical, de código abierto, que funciona a través de las api oficiales tanto de YouTube, como de Spotify. Repositorio publico: https://github.com/gzfac/factores')
        .setFooter('Todos los links, llevaran a los perfiles oficiales de GitHub')
        .setImage('https://www.cashadvance6online.com/data/archive/img/1621168033.gif')
        .setURL('https://github.com/gzfac/factores')
        .setThumbnail('https://assets1.ello.co/uploads/asset/attachment/6816497/ello-optimized-7826599c.gif')
        .setTimestamp()

    message.channel.send(embed);

}


client.login(token);