const { ytapikey } = require('./config.json');
const https = require('https')
class YTAPI {

    static buscarVideo(query) {
        return new Promise((devolver, rechazar) => {
            let url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=' + query + '&key=' + ytapikey
            https.get(url, (respuesta) => {
                respuesta.setEncoding('utf8');
                const body = [];
                if (respuesta.statusCode < 200 || respuesta.statusCode > 299) {
                    rechazar(new Error('Noooooo man se rompio todo' + respuesta.statusCode));
                }
                respuesta.on('data', (chunk) => body.push(chunk));
                respuesta.on('end', () => devolver(body.join('')));
            })
        })
    }

    static async retornarVideo(busqueda) {

        busqueda = busqueda.content.replace("!f ", "");
        let promise = await this.buscarVideo(busqueda)
            .then((data) => {
                let json = JSON.parse(data)
                let video = new Video();
                video.id = json.items[0].id.videoId
                video.titulo = json.items[0].snippet.title
                video.thumbnail = json.items[0].snippet.thumbnails.default.url;
                video.url = "https://www.youtube.com/watch?v=" + video.id
                return video;
            })
            .catch((err) => console.error(err))
        return promise;
    }
}

class Video {
    titulo = "";
    id = "";
    url = "";
    thumbnail = "";
}

module.exports = YTAPI;