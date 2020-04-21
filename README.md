# tic-tac-toe-gql-server

GraphQL server for supporting tic-tac-toe game.
## Getting Started

### Prerequisites

Required to have `node.js >= 10.x`. 

### Installing

To install on your machine, follow steps.

First clone the repository:
```
git clone https://github.com/MirnelBucan/tic-tac-toe-gql-server.git
```


Next install node_modules , running the command `npm install`.
Project is ready to run now.


### Usage

First copy .env.example

To start server, run:
```
npm run start:dev
```
This will start server in `dev mode`.
<br>
GraphQL server runs on: `http://localhost:4000/graphql`
<br>
GraphQL subscriptions runs on: `ws://localhost:4000/graphql`

To build, run:
```
npm run build
```
This will create `dist` folder in you root dir.
Other available command are in `package.json`, they're pretty straight forward.
### Notes
- Setup you `.env` file for jwt secret (if not set it uses fallback string) and other.
- Sqlite database is used provided in dir `db`, in `ormconfig.js` option for dropping schema on server restarts.
To change it set `dropSchema": false`.
- To access protected content on server , it will require to add authorization header. Example `autorhization: Bearer token`,
`token` will be provided on `mutation: createUser` in response. Tokens are permanent.
### Technologies
Project is build using:
- Apollo-server-expres
- Typegraphql
- Typeorm
- Typescript