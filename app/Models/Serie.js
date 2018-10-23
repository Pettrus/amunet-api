'use strict'

const Model = use('Model')

class Serie extends Model {
    static async salvar(usuario, imdb, temporada, ep, poster) {
        let serie = new Serie()
        serie.imdb_id = imdb
        serie.temporada = temporada
        serie.episodio = ep
        serie.usuario_id = usuario.id
        serie.poster = poster
        await serie.save()
    }
}

module.exports = Serie
