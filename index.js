const Discord = require('discord.js');
const { Intents } = require('discord.js')
const {prefix, token} = require('./config.json');
const ytdl = require('ytdl-core');
const { Player } =  require('discord-music-player');
const { RepeatMode } = require('discord-music-player');
const client = new Discord.Client({

    intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]

});  
const com = new Discord.MessageEmbed()

//const SpotifyWebApi = require('spotify-web-api-node');      

const constantQueue = [];
const queue = new Map();

client.once('ready', () => {

    console.log("La hiperlus se aproxima..");
    setupDefaultChannel();

});

client.once('reconnecting', () => {

    console.log("No pierdas la fe, derrapante..");

});

client.once('disconnect', () => {

    console.log("La hiperlus sea contigo..");

});

client.on('message', async message => {

    if (message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;

    const args = message.content.split(' ');
    const serverQueue = queue.get(message.guild.id);

    message.delete().then( msg => `Se borro el mensaje de: ${msg.author.username}`);

    if (message.content.startsWith(`${prefix}p`)) {

        execute(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}s`)) {

        skip(message, serverQueue);
        return;

    } else if (message.content.startsWith(`${prefix}w`)) {

        guildQueue.stop();
        stop(message, serverQueue);
        return;
    
    } else if (message.content.startsWith(`${prefix}h`)){

        help(message)
        return;

    } else if (message.content.startsWith(`${prefix}setup`)){

        setupDefaultChannel(message)
        return;


    } else {

        message.channel.send("Tu comando fue dodgeado..");

    }

});

async function execute(message, serverQueue) {

    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;

    if(!voiceChannel){

        return message.channel.send("Metete a un canal de voz forro");

    }

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {

        return message.channel.send("Dame permisos sorete");

    }

    const songInfo = await ytdl.getInfo(args[1]);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
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

        try{

            var connection = await voiceChannel.join();
            queueContruct.connection = connection;

            constantQueue.push(song)
            showQueue(message, message.channel);
            play(message.guild, queueContruct.songs[0])

        } catch (e) {

            console.log(e);
            queue.delete(message.guild.id);

            let errEmbed = Discord.MessageEmbed().setTitle("La cancion ingresada no existe..");

            return message.channel.send(errEmbed);

        }

    } else {

        constantQueue.push(song)
        console.log(serverQueue.songs);
        showQueue(message, message.channel);

    }

}

function play(guild, song){

    const serverQueue = queue.get(guild.id);

    if(!song) {

        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;

    }

    const dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {

        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);

    }).on("error", error => console.error(error));

    console.log(song)

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

}

function skip(message, serverQueue) {

    if(!message.member.voice.channel){

        return message.channel.send("Entra al canal pa skipear..");

    }

    if(!serverQueue){

        return message.channel.send("No se esta reproduciendo nada tontin..")

    }

    serverQueue.connection.dispatcher.end();

}

function stop(message, serverQueue) {

    if(!message.member.voice.channel){

        return message.channel.send("Metete al canal para stopear bobina..")

    }

    if(!serverQueue){

        return message.channel.send("No hay musica lastre..")

    }z

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();

}

function help(message){

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

function showQueue(message, channel){

    let showEmbed = new Discord.MessageEmbed().setTitle('\:banjo: Lista de canciones: ')

    constantQueue.forEach((element, index) => {
      
        showEmbed.addField(index + 1 + ". " + element.title, 'URL: ' + element.url)

    });

    a = channel.messages.fetch({ limit: 100 }).then(messages => {

        messages.forEach(message => message.delete());

    }).catch( err => console.log('No hay mensajes para borrar'));

    console.log(a)
    message.channel.send(showEmbed)

}

function setupDefaultChannel(message){

    let factoresChannel = client.channels.cache.get('factores');
    
    if(!factoresChannel){

        client.channels.create('factores', {

            type: "text",

            permissionOverwrites: [
                {
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'],
                }
             ],
            
        })

    }

}

client.login(token);