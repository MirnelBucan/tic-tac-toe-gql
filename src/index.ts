import 'reflect-metadata';
import dotenv from 'dotenv';
import {ApolloServer} from 'apollo-server-express';
import Express from 'express';
import {buildSchema} from 'type-graphql';
import {createConnection, useContainer} from "typeorm";
import {Container} from "typedi";
import {IContext} from "./types/IContext";
import eJwt from 'express-jwt';
import {authChecker} from "./utils/auth";
import {createServer} from "http";
import {formatError} from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || 4000;

useContainer(Container);

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
    authChecker,
    container: Container
  });

  const apolloServer = new ApolloServer({
    schema,
    playground: true,
    introspection: true,
    context: ({req, connection}): IContext => {
      if (connection) {
        return connection.context;
      }
      // @ts-ignore
      const user = req.user;
      return {
        req,
        user
      }
    },
    formatError: formatError
  });

  const app = Express();
  app.use(eJwt({
      secret: process.env.APP_SECRET || 'some_really_cool_secret_:D',
      credentialsRequired: false,
    })
  )

  apolloServer.applyMiddleware({app});

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen({port: PORT}, () => {
    console.log(`🚀- Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
    console.log(`🚀- Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
  })
};

main();