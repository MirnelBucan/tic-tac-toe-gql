# tic-tac-toe-gql-server

GraphQL API server for tic-tac-toe game.
## Getting Started

### Prerequisites

Required to have `node.js >= 10.x`. 

### Installing

First clone the repository:
```
git clone https://github.com/MirnelBucan/tic-tac-toe-gql-server.git
```
Next install node_modules, run `npm install`.
Project is ready for usage now.
### Usage
Note: Some variables are in `.env.example`. If you wish to override default copy `.env.example` into `.env`,
than set your environment variables.

To start server, run:
```
npm run start:dev
```
This will start server in `dev mode`.
<br>
Enjoy.
### Notes
- Setup you `.env` file for jwt secret (if not set it uses fallback string) and other.
- Sqlite database is used provided in dir `db`, in `ormconfig.js` option for dropping schema on server restarts.
To change it set `dropSchema": false`.
- To access protected content on server , it will require to add authorization header. Example `autorhization: Bearer token`,
`token` will be provided on `mutation: createUser` in response. Tokens are permanent.