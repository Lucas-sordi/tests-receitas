# tests-receitas

Testes automatizados para a API de [Receitas culinárias](https://github.com/Lucas-sordi/api-receitas) utilizando Jest, Supertest, Faker.js e Jsonschema.
##
#### Requisitos
[NodeJS](https://nodejs.org)
##
#### Instalação de dependências
`npm install`
##
#### Execução
`npm run test` irá rodar todos os testes.
`npm run test -t '<nome_do_arquivo>'` irá rodar um arquivo de teste em especifico.
###
Em package.json há o script "test:local", que possui o value "set TARGET=local&&jest".
Em src/config há o arquivo local.js, que é o apontamento do set TARGET. Desta forma, é possível configurar o template para rodar em ambientes diferentes.
