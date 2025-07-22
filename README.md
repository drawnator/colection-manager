# colection-manager
organizador de cartas para pokemon tcg onde você conseguirá criar baralhos e bulks e visualizar listas que está próximo de concluir.

# features
- gerenciamento de usuário
- organizar bulks
- organizar baralhos
- criar e adicionar cartas a bulks e baralhos

# Requirements:
- node.js com express
- typescript
- postgress

# Executando
1. criar um banco de dados postgress
2. criar um arquivo .env com os seguintes dados sobre o banco criado:
```
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=porta do postgress
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=seu_banco
```
3. abrir a o terminal dentro da pasta e executar: ```npm install```
4. executar o sistema: ```npm run dev```
5. dentro da pasta ./postman_collections você pode achar uma lista de requisições que você pode importar dentro do postman para testar

# atenção
algumas requisições pedem id de outros atributos então certifique-se de cria-los antes de tentar executar a requisição. por exemplo:

- para criar uma carta é necessário ter criado o dono dela e a coleção ao qual ela pertence primeiro.

- para adicionar uma carta a um baralho é necessário possuir um id de carta e baralho válidos
