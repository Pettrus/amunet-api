'use strict'

const Schema = use('Schema')

class AssistindoAgoraSchema extends Schema {
  up () {
    this.create('assistindo_agoras', (table) => {
      table.uuid('id').unique().defaultTo(this.db.raw('public.gen_random_uuid()')).primary()
      table.double('progresso').notNullable()
      table.string('nome').notNullable()
      table.string('background').notNullable()
      table.string('imdb_id').notNullable()
      table.string('caminho')
      table.text('magnet').notNullable()
      table.boolean('finalizado').notNullable()
      table.uuid('usuario_id').unsigned().references('id').inTable('usuarios').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('assistindo_agoras')
  }
}

module.exports = AssistindoAgoraSchema
