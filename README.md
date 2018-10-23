# Amunet API

Esse projeto foi feito em adonisjs com reactjs como [frontend](https://github.com/Pettrus/amunet-frontend)

![Screenshot 1](https://github.com/Pettrus/amunet-frontend/blob/master/screenshot2.jpg)

## Como inciar o projeto

Primeiro você deve criar um arquivo chamado .env alterando os valores de conexões e senhas de acordo com o seu local, já foi incluido um arquivo chamado .env.example que contem todos o nome das variáveis
```bash
HOST=0.0.0.0
PORT=8080
NODE_ENV=development

APP_NAME=Amunet
APP_URL=http://${HOST}:${PORT}

CACHE_VIEWS=false

DB_CONNECTION=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=SENHA
DB_DATABASE=amunet

HASH_DRIVER=bcrypt

CAMINHO_STREAM='CAMINHO_FISICO_ONDE_ARQUIVOS_SERAO_SALVOS'
```

Depois que o banco foi criado e a conexão esteja estabelecida use o comando para migrar as tabelas
```bash
adonis migration:run
```

Para iniciar o projeto
```bash
adonis serve --dev
```

Para produção recomendo utilizar [PM2](https://github.com/Unitech/pm2)
