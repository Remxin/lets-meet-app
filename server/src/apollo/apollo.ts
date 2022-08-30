import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import express from "express";
import http from "http";

// --- importing typeDefs and resolvers ---
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";

export async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.urlencoded({ extended: true }))
  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    typeDefs,
    resolvers,
  });

  // More required logic for integrating with Express
  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(
    `🚀 Apollo server ready at http://localhost:4000${server.graphqlPath}`
  );
}
