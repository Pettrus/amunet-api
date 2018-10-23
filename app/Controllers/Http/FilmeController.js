'use strict'

const axios = use('axios')
const URL = 'https://yts.am/api/v2/'

class FilmeController {
    async pesquisar({ params }) {
        const result = await axios({
            url: URL + 'list_movies.json?query_term=' + params.titulo,
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        return result.data
    }

    async detalhe({ params }) {
        const result = await axios({
            url: URL + 'movie_details.json?movie_id=' + params.id + '&with_images=true&with_cast=true',
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        return result.data
    }

    async recentes({ params }) {
        try {
            let url = URL + 'list_movies.json?sort_by=date_added&limit=30&minimum_rating=5';

            if(params.pagina != null) {
            url += '&page=' + params.pagina;
            }

            const result = await axios({
                url: url,
                method: 'GET',
                headers: {'Accept': 'application/json'}
            })

            return result.data
        }catch(e) {
            console.log(e)
            console.log("erro")
        }
    }

    async genero({ params }) {
      let url = URL + 'list_movies.json?sort_by=year&limit=30&minimum_rating=4&genre=' + params.genero;

      if(params.pagina != null) {
        url += '&page=' + params.pagina
      }

      const result = await axios({
          url: url,
          method: 'GET',
          headers: {'Accept': 'application/json'}
      })

      return result.data
    }

    async maisBaixados() {
        const result = await axios({
            url: URL + 'list_movies.json?sort_by=download_count&limit=4',
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        return result.data
    }

    async bemAvaliados() {
        const result = await axios({
            url: URL + 'list_movies.json?sort_by=rating&limit=4',
            method: 'GET',
            headers: {'Accept': 'application/json'}
        })

        return result.data
    }
}

module.exports = FilmeController
