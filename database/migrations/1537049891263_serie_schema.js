'use strict'

const Schema = use('Schema')

class SerieSchema extends Schema {
  up () {
    this.create('series', (table) => {
      table.uuid('id').unique().defaultTo(this.db.raw('public.gen_random_uuid()')).primary()
      table.string('imdb_id').notNullable()
      table.string('poster').notNullable()
      table.integer('temporada').notNullable()
      table.integer('episodio').notNullable()
      table.uuid('usuario_id').unsigned().references('id').inTable('usuarios').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('series')
  }
}

module.exports = SerieSchema
