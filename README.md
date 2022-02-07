## Transference Gateway API (DQR TEST)
Este projeto é um teste de competência aplicado pela empresa DQR para seu processo seletivo. Sendo assim todos os requisitos funcionais vieram da mesma.

Segue a descrição da demanda: “A proposta é fazer um serviço de transferência que será utilizado por outros serviços dentro de uma mesma empresa. O seu serviço deve receber requisição para efetuar uma Transferência de um determinado valor (considerar 2 casas decimais), enviar os dados necessários para a plataforma de Liquidação do banco e retornar uma resposta para o serviço do cliente. “

Partindo do escopo acima, fora desenvolvido tanto o serviço chamado pelo cliente, quanto um mock que simulará a api bancária de liquidação. Ambas estão no mesmo projeto, separada por módulos independentes.

Para um client consumir o serviço, ele terá de informar 2 contas para a transferência. Essas contas devem estar previamente cadastradas também na api, sendo assim, tais rotas foram disponibilizadas para esse fim.

Assim que um cliente cadastra uma transferência, é enviado uma requisição para o serviço de liquidação. Caso o serviço esteja indisponível ou ocorra algum erro inesperado, a transferência será assinada com true em um campo chamada <paymentOrderError>. Caso o serviço esteja funcionando plenamente, um registro chamado payment order será criado e retornado. Serão possíveis 3 status nessa chamada:
- CREATED – Significa que o registro de liquidação foi criado com sucesso, e que em alguns milissegundos ele será atualizado para APPROVED
- REJECTED – Segnifica que o usuário informou uma data de operação expirada, ou seja, que já venceu. Sendo assim, nada ocorrerá com esse registro, além de manter o histórico.
- SCHEDULED – Caso o usuário informe uma data acima de 24h, o mock irá criar um registro com status SCHEDULED e retornar para a api de transferências.
     
Logo após o registro do com status do tipo CREATED ser registrado, o mock irá atualizá-lo para APPROVED, para que nas buscas posteriores, o mesmo seja disponibilizado assim.

## Tecnologias Usadas
Para desenvolver este teste, fora usado nodejs juntamente com a plataforma [nestjs](https://nestjs.com/). Como solução de banco de dados, fora utilizado um sqlite que ficará armazenada dentro de {raiz}/db/db.sqlte.

## Setup do Projeto

Para executar o projeto, é necessário clonar o repositório, criar um .env a partir do .env.sample que existe na raiz do projeto e seguir os passos adiante.

Obs. Caso seja necessário alterar a porta em que o projeto é executado, basta alterar dentro de .env o parâmetro APP_PORT.

### Instalção
```bash
$ npm install
```

### Executando a api

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Rodando os testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API METHODS

### POST /api/account
Criar uma nova conta
#### BODY
```json
{
    "owner": "ramon costa 1",
    "alias": "conta principal 2"
}
```
#### RESPONSE
```json
{
  "message": "payment-gateway:account_created",
  "data": {
    "owner": "ramon costa 2",
    "alias": "conta principal 2",
    "id": 2
  }
}
```
#### ERRORS
    - 400: Caso o usuário informe dois registros com o mesmo nome e mesmo alias a api irá emitar um erro
    - 500: Caso o usuário deixe de informar algum dos campos mandatórios.

### GET /api/account
Listar contas 
#### RESPONSE
```json
{
    "message": "payment-gateway:list_created",
    "data": [
        {
            "id": 1,
            "alias": "conta principal 2",
            "owner": "ramon costa"
        },
        {
            "id": 2,
            "alias": "conta principal 2",
            "owner": "ramon costa 1"
        }
    ]
}
```
### POST /api/transference
Criar Transferencia 
#### BODY
```json
{
  "amount": 234.12,
  "accountFromId": 1,
  "accountToId": 2,
  "expectedOn": "2021-09-01"
}
```
#### RESPONSE
```json
{
  "message": "payment-gateway:make_transfer",
  "data": {
    "transference": {
      "amount": 234.12,
      "accountFromId": 1,
      "accountToId": 2,
      "expectedOn": "2021-09-01T00:00:00.000Z",
      "transferenceTo": {
        "id": 2,
        "alias": "conta principal 2",
        "owner": "ramon costa 2"
      },
      "transferenceFrom": {
        "id": 1,
        "alias": "conta principal 2",
        "owner": "ramon costa 1"
      },
      "id": 20,
      "createdAt": "2022-02-04T17:44:34.000Z",
      "paymentOrderError": false
    },
    "order": {
      "externalId": 20,
      "expectedOn": "2021-09-01T00:00:00.000Z",
      "amount": 23412,
      "status": "approved",
      "id": 20
    }
  }
}
```
#### ERRORS
    - 404: Conta origem não encontrada
    - 404: Conta destino não encontrada
    - 500: Caso o usuário deixe de informar algum dos campos mandatórios.

### GET /api/transference/:tranferenceId
Status da Transfência

#### RESPONSE
```json
{
  "message": "payment-gateway:get_transference",
  "data": {
    "transference": {
      "id": 7,
      "amount": 1,
      "expectedOn": "2022-09-01T00:00:00.000Z",
      "createdAt": "2022-02-04T02:24:18.000Z"
    },
    "order": {
      "id": 12,
      "expectedOn": "2022-09-01T00:00:00.000Z",
      "amount": 1,
      "externalId": 7,
      "status": "scheduled"
    }
  }
}
```
#### ERRORS
    - 404: Tranferencia não encontrada

### GET /api/transference
Listar Transfências

#### RESPONSE
```json
{
  "message": "payment-gateway:get_transference",
  "data": [
      {
        "id": 1,
        "amount": 1,
        "expectedOn": "2022-09-01T00:00:00.000Z",
        "createdAt": "2022-02-04T00:13:59.000Z",
        "paymentOrderError": false,
        "transferenceFrom": null,
        "transferenceTo": null
      },
      {
        "id": 2,
        "amount": 1,
        "expectedOn": "2022-09-01T00:00:00.000Z",
        "createdAt": "2022-02-04T00:13:59.000Z",
        "paymentOrderError": false,
        "transferenceFrom": {
          "id": 1,
          "alias": "conta principal 2",
          "owner": "ramon costa 1"
        },
        "transferenceTo": {
          "id": 2,
          "alias": "conta principal 2",
          "owner": "ramon costa 2"
        }
      }
  ]
}
```

### MOCK Methods
### POST /api/mock/order
Criar Ordem de Pagamento

#### BODY
```json
{
    "amount": 1,
    "expectedOn": "2022-02-04T07:00:00",
    "externalId": 1233
}
```

#### RESPONSE
```json
{
  "message": "mock:order_created",
  "data": {
    "externalId": 1233,
    "expectedOn": "2022-02-04T10:00:00.000Z",
    "amount": 1,
    "status": "created",
    "id": 10
  }
}
```

#### ERRORS
    - 405: Caso um external id seja informado pela segunda vez
    - 500: Caso algum campo mandatório não seja informado

### GET /api/mock/order/:externalId
Obter Ordem de Pagamento

#### RESPONSE
```json
{
  "message": "mock:order_created",
  "data": {
    "externalId": 1233,
    "expectedOn": "2022-02-04T10:00:00.000Z",
    "amount": 1,
    "status": "created",
    "id": 10
  }
}
```

#### ERRORS
    - 404: Caso nem uma ordem de pagamento seja encontrada.

## Docker 
Para executar o projeto em um container ja foi disponibilizado um Dockerfile para isso.
Para executar basta executar os seguintes comandos:
```bash
docker build -t [image-name] . ## Build da imagem
docker run --name [container-name] -p [port]:4531 [image-name]
```