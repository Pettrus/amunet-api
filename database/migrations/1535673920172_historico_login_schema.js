'use strict'

const Schema = use('Schema')

class HistoricoLoginSchema extends Schema {
  up () {
    this.create('historico_logins', (table) => {
      table.uuid('id').unique().defaultTo(this.db.raw('public.gen_random_uuid()')).primary()
      table.dateTime('data_login').notNullable()
      table.uuid('usuario_id').unsigned().references('id').inTable('usuarios').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('historico_logins')
  }
}

module.exports = HistoricoLoginSchema
