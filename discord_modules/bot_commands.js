const {globals, queue} = require('../index');
const ytdl = require('ytdl-core');

class DISCORD_COMMANDS{

    static async execute(message, serverQueue) {

        const args = message.content.split(" ");
    
        const voiceChannel = message.member.voice.channel;
    
        if(!voiceChannel){
    
            return message.channel.send("Ingresa a un canal de voz primero..");
    
        }
    
        const permissions = voiceChannel.permissionsFor(message.client.user);
    
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    
            return message.channel.send("Los permisos no me permiten reproducir música!");
    
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
    
            globals.queue.set(message.guild.id, queueContruct)
    
            queueContruct.songs.push(song);
    
            try{
    
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
    
                globals.constantQueue.push(song)

                showQueue(message, message.channel);
                play(message.guild, queueContruct.songs[0])
    
            } catch (e) {
    
                console.log(e);
                globals.queue.delete(message.guild.id);
    
                let errEmbed = Discord.MessageEmbed().setTitle("La cancion ingresada no existe..");
    
                return message.channel.send(errEmbed);
    
            }
    
        } else {
    
            globals.constantQueue.push(song)
            console.log(serverQueue.songs);
            showQueue(message, message.channel);
    
        }
    
    }
    
    static play(guild, song){
    
        const serverQueue = globals.queue.get(guild.id);
    
        if(!song) {
    
            serverQueue.voiceChannel.leave();
            globals.queue.delete(guild.id);
            return;
    
        }
    
        const dispatcher = serverQueue.connection.play(ytdl(song.url)).on("finish", () => {
    
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
    
        }).on("error", error => console.error(error));
    
        console.log(song)
    
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
    }
    
    static skip(message, serverQueue) {
    
        if(!message.member.voice.channel){
    
            return message.channel.send("Ingrese a un canal de voz primero..");
    
        }
    
        if(!serverQueue){
    
            return message.channel.send("No se esta reproduciendo ninguna cancion..")
    
        }
    
        serverQueue.connection.dispatcher.end();
    
    }
    
    static stop(message, serverQueue) {
    
        if(!message.member.voice.channel){
    
            return message.channel.send("Ingrese a un canal de voz primero..")
    
        }
    
        if(!serverQueue){
    
            return message.channel.send("No se esta reproduciendo ninguna cancion..")
    
        }
    
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
    
    }
    
    static help(message){
    
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
    
    static showQueue(message, channel){
    
        let showEmbed = new Discord.MessageEmbed().setTitle('\:banjo: Lista de canciones: ')
    
        globals.constantQueue.forEach((element, index) => {
          
            showEmbed.addField(index + 1 + ". " + element.title, 'URL: ' + element.url)
    
        });
    
        msg = channel.messages.fetch({ limit: 100 }).then(messages => {
    
            messages.forEach(message => message.delete());
    
        }).catch( () => console.log('No hay mensajes para borrar'));
    
        console.log(a)
        message.channel.send(showEmbed)
    
    }
    
    static setupDefaultChannel(message){
    
        let factoresChannel = message.guild.channels.cache.get('factores');
        
        if(!factoresChannel){
    
            message.guild.channels.create('factores', {
    
                type: "text"
                
            })
    
        } else {

            message.channel.send("El canal 'factores' ya fue creado..");

        }
    
    }

}

module.exports = DISCORD_COMMANDS;