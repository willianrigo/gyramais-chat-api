##Sobre o projeto
API para chats públicos.
Feito utilizando Realtime database do Google Firebase e GraphQL.

## Setup

Instale as dependências e execute o projeto localmente.

### `npm install`
### `firebase serve`

Para fazer o deploy no Functions do Google:

### `firebase deploy`


###Chamadas na API:

Se executar o projeto localmente, utilize o endereço [http://localhost:5000/graphql-test-f4474/us-central1/graphql]

###Exemplos de queries:
Buscar todas as mensagens e usuários cadastrados:

{
 
  messages{
    author
    data
    timestamp
  }
  
  users{
    avatarId
    name
    token
  }
}


Adicionar mensagem nova:

mutation{
 
  addMessage(data: "conteúdo da mensagem", timestamp: "2019-10-10 13:00", author: "John Marston", avatarId: 2){
    author
    data
    timestamp,
    avatarId
  }

}


Adicionar novo usuário:
mutation{
 
  addUser(name: "Novo usuario", avatarId: 1, token: "123123"){
    name
    avatarId
    token
  }

### Melhorias previstas para próximas versões

Melhorias no código:
- Criação de módulos para cada funcionalidade
