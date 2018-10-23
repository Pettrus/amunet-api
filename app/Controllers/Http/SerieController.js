'use strict'

const axios = use('axios')
const Serie = use('App/Models/Serie')
const URL = 'https://tv-v2.api-fetch.website/'

class SerieController {
    async recentes({ params }) {
        let url = URL + 'shows/'

        if(params.pagina != null) {
            url += params.pagina
        }else {
            url += '1'
        }

        const result = await axios({
            url: url + '?sort=updated&order=-1',
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        return result.data
    }

    async pesquisar({ params }) {
        const result = await axios({
            url: URL + 'shows/1?sort=year&order=-1&keywords=' + params.titulo,
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        return result.data
    }

    async detalhe({ params }) {
        const result = await axios({
            url: URL + 'show/' + params.id,
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        let serie = result.data
        let serieDB = await Serie.findBy({imdb_id: params.id})

        if(serieDB != null) {
            serie.temporada_assistido = serieDB.temporada
            serie.episodio_assistido = serieDB.episodio
        }
  
        return serie
    }

    async download({ request, auth }) {
        const { imdb_id, temporada, episodio, poster } = request.all()
        const serie = await Serie.findBy({imdb_id: imdb_id})

        if(serie == null) {
            Serie.salvar(auth.user, imdb_id, temporada, episodio, poster)
        }else {
            serie.temporada = temporada
            serie.episodio = episodio
            await serie.save()
        }

        return true
    }

    async minhaLista({ auth }) {
        try {
            const series = await Serie.query().where('usuario_id', auth.user.id)

            return series
        }catch(e) {
            console.log(e);
        }
    }

    async remover({ request, auth }) {
        try {
            const { imdb_id } = request.all()

            const serie = await Serie.findBy({imdb_id: imdb_id, usuario_id: auth.user.id})
            await serie.delete()

            return true
        }catch(e) {
            console.log(e)
        }
    }
}

module.exports = SerieController
