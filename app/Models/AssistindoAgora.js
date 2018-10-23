'use strict'

const Model = use('Model')
const Helpers = use('Helpers')
const Env = use('Env')
const fs = Helpers.promisify(require('fs'))

class AssistindoAgora extends Model {
    static async salvar(progresso, nome, caminho, magnet, imdb, usuario, background) {
        const existe = await AssistindoAgora.findBy({ imdb_id: imdb, usuario_id: usuario})

        if(existe == null) {
            const ao = new AssistindoAgora()
            ao.progresso = progresso
            ao.nome = nome
            ao.imdb_id = imdb
            ao.caminho = caminho
            ao.magnet = magnet
            ao.usuario_id = usuario
            ao.finalizado = false
            ao.background = background
            await ao.save()
        }else {
            existe.progresso = progresso
            await existe.save()
        }
    }

    static async finalizar(usuario) {
        const assistindo = await AssistindoAgora.findBy({usuario_id: usuario})

        assistindo.finalizado = true
        await assistindo.save()
    }

    static async baixarLegenda(auth) {
        const request = Helpers.promisify(require('request'))
        const cheerio = require('cheerio')
        const path = require('path')
        const unzipper = require('unzipper')
        const urlBase = "https://www.opensubtitles.org"

        const assistindo = await AssistindoAgora.findBy({usuario_id: auth.user.id})

        let nome = assistindo.nome
        nome = nome.replace(/ /g,"+")

        let link = null
        const pastaArquivos = assistindo.caminho.split("/")[0] + "/"
        let nomeArquivo = assistindo.caminho.split("/")[1]
        nomeArquivo = nomeArquivo.replace(".mp4", "")

        let html = await request(urlBase + "/pt/search2/sublanguageid-por,pob/moviename-" + nome)
        let $ = cheerio.load(html.body)

        $('.bnone').each(function() {
            link = $(this).attr('href')
            return false
        })

        html = await request(urlBase + link)
        $ = cheerio.load(html.body)

        $('.change').each(function() {
            let nomeGrande = $(this).find('td span').attr('title')
            let nomePequeno = $(this).find('td').clone()
                .children()
                .remove()
                .end()
                .text()

            if((nomePequeno != null && nomePequeno.includes(nomeArquivo)) ||
                nomeGrande != null && nomeGrande.includes(nomeArquivo)) {
                link = $(this).find('td strong a').attr('href')
                return false
            }
        })

        if(link == null) {
            return false
        }

        const pedaco = link.split("/")
        let idSub = null

        if(typeof pedaco[3] == 'number') {
            idSub = pedaco[3]
        }else {
            const subP = link.split("-")
            idSub = subP[subP.length - 1]
        }

        console.log(link)

        const req = await request({url: urlBase + '/pt/subtitleserve/sub/' + idSub, encoding: null})

        let caminho = Env.get('CAMINHO_STREAM') + auth.user.id + "/" + pastaArquivos
        await fs.writeFile(caminho + idSub + ".zip", req.body)

        await fs.createReadStream(caminho + idSub + ".zip")
            .pipe(unzipper.Parse())
            .on('entry', function (entry) {

            console.log("ABRIU O ZIP")
            var fileName = entry.path;
            var type = entry.type; // 'Directory' or 'File'
            var size = entry.size;

            console.log(fileName)
            console.log(path.extname(fileName))

            if (path.extname(fileName) == ".srt") {
                entry.pipe(fs.createWriteStream(caminho + pastaArquivos + "legenda.srt"));
            } else {
                entry.autodrain();
            }
        })

        return pastaArquivos
    }

    static async converterLegenda(pastaArquivos, auth) {
        const srt2vtt = require('srt-to-vtt')

        await fs.createReadStream(Env.get('CAMINHO_STREAM') + auth.user.id + "/" + pastaArquivos + "legenda.srt")
            .pipe(srt2vtt())
            .pipe(fs.createWriteStream(Env.get('CAMINHO_STREAM') + auth.user.id + "/" + pastaArquivos + "legenda.vtt"))
    }
}

module.exports = AssistindoAgora
