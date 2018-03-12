"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const connections_1 = require("../connections");
const films_1 = __importDefault(require("./films"));
const relayNode_1 = require("../relayNode");
const graphql_relay_1 = require("graphql-relay");
const ActorType = new graphql_1.GraphQLObjectType({
    name: 'Actor',
    fields: () => ({
        firstName: {
            type: graphql_1.GraphQLString,
            description: 'The employee\'s first name',
            resolve: actor => actor.first_name
        },
        lastName: {
            type: graphql_1.GraphQLString,
            description: 'The employee\'s last name',
            resolve: actor => actor.last_name
        },
        filmsConnection: connections_1.connectionFromUrls('ActorFilm', 'films', films_1.default),
        id: graphql_relay_1.globalIdField('actors')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = ActorType;
