"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const connections_1 = require("../connections");
const relayNode_1 = require("../relayNode");
const films_1 = __importDefault(require("./films"));
const graphql_relay_1 = require("graphql-relay");
const CategoryType = new graphql_1.GraphQLObjectType({
    name: 'Category',
    description: 'A single category',
    fields: () => ({
        name: {
            type: graphql_1.GraphQLString
        },
        filmsConnection: connections_1.connectionFromUrls('CategoryFilms', 'films', films_1.default),
        id: graphql_relay_1.globalIdField('categories')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = CategoryType;
