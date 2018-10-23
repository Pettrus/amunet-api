'use strict'

const Hash = use('Hash')
const Usuario = use('App/Models/Usuario')

class UsuarioController {
  async login({request, auth, response}) {
    const {email, password} = request.all()
    let token = await auth.attempt(email, password)

    const usuario = await Usuario.findBy({email: email})
    await Usuario.salvarToken(usuario, token.token)
    await Usuario.salvarHistorico(usuario)

    response.header('Authorization', 'Bearer ' + token.token)
    response.header('refreshtoken', token.refreshToken)

    return true
  }

  async validateToken({ auth, request }) {
    try {
      await auth.check()

      const valido = Usuario.tokenValido(auth.user, request.header('Authorization'))

      if(valido) {
        await Usuario.salvarHistorico(auth.user)
      }

      return valido
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async alterarSenha({ request, auth }) {
    const {atual, nova} = request.all()

    const valido = await Hash.verify(
        atual,
        auth.user.password
    )

    if(!valido) {
      return ["Senha atual inválida."]
    }

    auth.user.password = nova
    await auth.user.save()

    return true
  }

  async dados({ auth }) {
    try {
      return {
        id: auth.user.id,
        nome: auth.user.nome,
        email: auth.user.email
      }
    }catch(e) {
      console.log(e)
    }
  }
}

module.exports = UsuarioController
