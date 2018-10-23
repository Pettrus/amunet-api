'use strict'

const Model = use('Model')
const Hash = use('Hash')
const HistoricoLogin = use('App/Models/HistoricoLogin')
const Token = use('App/Models/Token')

class Usuario extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static async salvarToken(usuario, token) {
    let t = await Token.findBy({usuario_id: usuario.id, type: 'bearer'})

    if(t == null) {
      t = new Token()
      t.usuario_id = usuario.id
      t.type = 'bearer'
    }

    t.token = token
    await t.save()
  }

  static async salvarHistorico(usuario) {
    let historico = new HistoricoLogin()
    historico.usuario_id = usuario.id
    historico.data_login = new Date()
    await historico.save()
  }

  static async tokenValido(usuario, headerToken) {
    const token = await Token.findBy({usuario_id: usuario.id, token: headerToken.replace('Bearer ', '')})

    if(token != null) {
      return true
    }

    return false
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  HistoricoLogins() {
    return this.hasMany('App/Models/HistoricoLogin')
  }
}

module.exports = Usuario
