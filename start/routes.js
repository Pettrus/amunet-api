'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.get('/', ({ request }) => {
  return { greeting: 'Hello world in JSON' }
})

Route.post('login', 'UsuarioController.login')
Route.get('validate-token', 'UsuarioController.validateToken')

Route.group(() => {
  Route.get('/dados', 'UsuarioController.dados')
  Route.post('/alterar-senha', 'UsuarioController.alterarSenha')
}).prefix('usuario').middleware('auth')

Route.group(() => {
  Route.get('/pesquisar/:titulo', 'SerieController.pesquisar')
  Route.get('/recentes', 'SerieController.recentes')
  Route.get('/recentes/:pagina', 'SerieController.recentes')
  Route.get('/detalhe/:id', 'SerieController.detalhe')
  Route.get('/minha-lista', 'SerieController.minhaLista')
  
  Route.post('/download', 'SerieController.download')
  Route.post('/remover', 'SerieController.remover')
}).prefix('series').middleware('auth')

Route.group(() => {
  Route.get('/pesquisar/:titulo', 'FilmeController.pesquisar')
  Route.get('/detalhe/:id', 'FilmeController.detalhe')
  Route.get('/recentes', 'FilmeController.recentes')
  Route.get('/recentes/:pagina', 'FilmeController.recentes')
  Route.get('/genero/:genero', 'FilmeController.genero')
  Route.get('/genero/:genero/:pagina', 'FilmeController.genero')
  Route.get('/mais-baixados', 'FilmeController.maisBaixados')
  Route.get('/bem-avaliados', 'FilmeController.bemAvaliados')
}).prefix('filmes').middleware('auth')

Route.group(() => {
  Route.get('/baixando-agora', 'AssistirOnlineController.baixandoAgora')

  Route.post('/pre-assistir', 'AssistirOnlineController.preAssistir')
  Route.post('/remover-filme', 'AssistirOnlineController.removerFilme')
  Route.post('/baixar-legenda', 'AssistirOnlineController.baixarLegenda')
}).prefix('assistir-online').middleware('auth')

Route.get('assistir-online/play/:usuario/:caminho', 'AssistirOnlineController.assistirOnline')
Route.get('assistir-online/play/servir-legenda/:usuario/:caminho', 'AssistirOnlineController.servirLegenda')

Route.post('series/procurar-legendas', 'SeriesController.procurarLegenda')
