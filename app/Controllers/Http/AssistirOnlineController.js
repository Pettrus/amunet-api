'use strict'

const AssistindoAgora = use('App/Models/AssistindoAgora')
const Helpers = use('Helpers')
const Env = use('Env')
const fs = Helpers.promisify(require('fs'))

class AssistirOnlineController {
    async baixarLegenda({ auth }) {
        try {
            const pasta = await AssistindoAgora.baixarLegenda(auth)

            if(pasta == false) {
                return false
            }

            await this.timeout(2500)

            await AssistindoAgora.converterLegenda(pasta, auth)

            return true
        }catch(e) {
            console.log(e)
        }
    }

    async servirLegenda({ params, response }) {
        try {
            let caminhoEscape = decodeURI(params.caminho)
            caminhoEscape = caminhoEscape.replace("%2F", "/")

            let legenda = await fs.readFile(Env.get('CAMINHO_STREAM') + params.usuario + "/" + caminhoEscape.split("/")[0] + "/legenda.vtt")

            response.send(legenda)
        }catch(e) {
            console.log(e)
        }
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async preAssistir({ request, auth }) {
        try {
            const { torrentHash, imdb, slug, nome, background } = request.all()

            const jaBaixando = await AssistindoAgora.findBy({usuario_id: auth.user.id})

            if(jaBaixando != null) {
                return false;
            }
          
            const mag = 'magnet:?xt=urn:btih:' + torrentHash + '&dn=' + slug + '&tr=- udp://tracker.openbittorrent.com:80'

            const WebTorrent = require('webtorrent')
            const client = new WebTorrent()
            let caminho = null

            client.add(mag, { path: Env.get('CAMINHO_STREAM') + auth.user.id }, function (torrent) {
                console.log('Client is downloading:', torrent.infoHash)

                const interval = setInterval(() => {
                    console.log("Atualizando progresso " + new Date())
                    console.log(torrent.progress)
                    AssistindoAgora.salvar(torrent.progress, nome, caminho, mag, imdb, auth.user.id, background)
                }, 5000)

                torrent.files.forEach(function (file) {
                    let extensao = file.path.slice((file.path.lastIndexOf(".") - 1 >>> 0) + 2);
                    if(extensao == "mp4" && caminho == null) {
                        caminho = file.path
                    }
                })

                torrent.on('done', function () {
                    console.log("cabou o download")
                    clearInterval(interval)
                    torrent.destroy()
                    AssistindoAgora.finalizar(auth.user.id)
                })
            })

            return true
        }catch(e) {
            console.log(e)
        }
    }

    async baixandoAgora({ auth }) {
        try {
            const baixando = AssistindoAgora.findBy({usuario_id: auth.user.id})

            return baixando
        }catch(e) {
            console.log(e)
        }
    }

    async removerFilme({ auth }) {
        try {
            const assistindo = await AssistindoAgora.findBy({usuario_id: auth.user.id})
            const caminho = Env.get('CAMINHO_STREAM') + auth.user.id + "/" + assistindo.caminho.split("/")[0]

            if( fs.existsSync(caminho) ) {
                fs.readdirSync(caminho).forEach(function(file,index){
                    var curPath = caminho + "/" + file;
                    if(fs.lstatSync(curPath).isDirectory()) { // recurse
                        deleteFolderRecursive(curPath);
                    } else { // delete file
                        fs.unlinkSync(curPath);
                    }
                });
                fs.rmdirSync(caminho);
            }

            await assistindo.delete()

            return true
        }catch(e) {
            console.log(e)
        }
    }

    async assistirOnline({ params, request, response }) {
        try {
            response.implicitEnd = false
            let caminhoEscape = decodeURI(params.caminho)
            caminhoEscape = caminhoEscape.replace("%2F", "/")

            const path = Env.get('CAMINHO_STREAM') + params.usuario + "/" + caminhoEscape;
            const range = request.header('range')
            const stat = await fs.statSync(path)
            const fileSize = stat.size

            if(range) {
                const parts = range.replace(/bytes=/, "").split("-")
                const start = parseInt(parts[0], 10)
                const end = parts[1] 
                    ? parseInt(parts[1], 10)
                    : fileSize-1
                const chunksize = (end-start)+1

                response.header('Content-Range', `bytes ${start}-${end}/${fileSize}`)
                response.header('Accept-Ranges', 'bytes')
                response.header('Content-Length', chunksize)
                response.header('Content-Type', 'video/mp4')
                response.status(206)

                let stream = fs.createReadStream(path, { start, end });
                stream.on('open', chunk => {
                    stream.pipe(response.response)
                    //response.send(chunk)
                })

                stream.on('error', (streamErr) => {
                    response.end(streamErr)
                })

                stream.on("end", () => {
                    response.end()
                })
            }else {
                response.header('Content-Length', fileSize)
                response.header('Content-Type', 'video/mp4')

                response.status(200)

                let stream = fs.createReadStream(path);
                stream.on('open', chunk => {
                    stream.pipe(response.response)
                    //response.send(chunk)
                })

                stream.on('error', (streamErr) => {
                    response.end(streamErr)
                })

                stream.on("end", () => {
                    response.end()
                })
            }
        }catch(e) {
            console.log(e)
        }
    }
}

module.exports = AssistirOnlineController
