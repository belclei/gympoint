# gympoint

Dentro da pasta do projeto, executar:

```bash
yarn init -y
```

Adicionar o pacote do framework utilizado no projeto

```bash
yarn add express
```

Para manter server atualizado e rodando durante a alteração dos fontes, adicionar a seguinte dependência de desenvolvimento:

```bash
yarn add nodemon -D
```

Para permitir o uso de um "javascript moderno", utilizando `import/export` em vez de `require/exports`, é adicionada a próxima dependência de desenvolvimento:

```bash
yarn add sucrase -D
```

Para que estas duas dependências funcionem corretamente juntas, precisa existir o arquivo `nodemon.json`.
A seguinte biblioteca auxilia o projeto a manter padronizações e boas práticas de programação:

```bash
yarn add eslint -D
yarn eslint --init
```

responder as perguntas sobre a padronização que será aplicada pelo `eslint`.
apagar arquivo gerado pelo `npm`.

```bash
yarn
```

configurar `eslintrc.js`.

```bash
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

configurar novo arquivo `.prettierrc` para manter compatibilidade com styleguide do airbnb.
Para corrigir padronização de todos os `.js` da pasta `src`, executar

```bash
yarn eslint --fix src --ext .js
```

Clicar com o o botão direito na área do VSCode onde é exibida a árvore de arquivos do projeto, e selecionar `Generate .editorconfig`. Este arquivo serve para manter a compatibilidade de código entre diferentes editores de código de diferentes programadores.

Conceitos importante de MVC:

- Controller _não_ chama Controller
- Controller só possui 5 métodos possíveis:
  - index()
  - show()
  - store()
  - update()
  - delete()

São utilizadas também as seguintes bibliotecas:

- `Sequelize` - ORM que permite manipulação da base de dados sem uso de SQL;
- `jsonwebtoken` - para tratamento de JWT, que mantém a segurança na autenticação da aplicação;
- `yup`- utilizada para validação em _schema validation_ dos parâmetros recebidos da requisição rest;

Também foram utilizadas as seguintes ferramentas:

- Docker
- http://md5online.org
- Insomnia
- Postbird
