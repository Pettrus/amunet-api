'use strict'

/*
|--------------------------------------------------------------------------
| UsuarioSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Database = use('Database')

class UsuarioSeeder {
  async run () {
    const usuarios = await Factory
      .model('App/Models/Usuario')
      .create()
  }
}

module.exports = UsuarioSeeder
