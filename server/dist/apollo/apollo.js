"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApolloServer = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
// --- importing typeDefs and resolvers ---
const typeDefs_1 = require("./typeDefs");
const resolvers_1 = require("./resolvers");
function startApolloServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // Required logic for integrating with Express
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        app.use(express_1.default.urlencoded({ extended: true }));
        // Same ApolloServer initialization as before, plus the drain plugin.
        const server = new apollo_server_express_1.ApolloServer({
            plugins: [(0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
            typeDefs: typeDefs_1.typeDefs,
            resolvers: resolvers_1.resolvers,
        });
        // More required logic for integrating with Express
        yield server.start();
        server.applyMiddleware({
            app,
            path: "/",
        });
        yield new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
        console.log(`🚀 Apollo server ready at http://localhost:4000${server.graphqlPath}`);
    });
}
exports.startApolloServer = startApolloServer;
