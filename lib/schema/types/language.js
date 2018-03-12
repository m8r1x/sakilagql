"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const relayNode_1 = require("../relayNode");
const graphql_relay_1 = require("graphql-relay");
const LanguageType = new graphql_1.GraphQLObjectType({
    name: 'Language',
    fields: () => ({
        name: {
            type: graphql_1.GraphQLString
        },
        id: graphql_relay_1.globalIdField('languages')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = LanguageType;
