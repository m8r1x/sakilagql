"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const relayNode_1 = require("../relayNode");
const graphql_relay_1 = require("graphql-relay");
const connections_1 = require("../connections");
const city_1 = __importDefault(require("./city"));
const CountryType = new graphql_1.GraphQLObjectType({
    name: 'Country',
    fields: () => ({
        countryName: {
            type: graphql_1.GraphQLString,
            resolve: country => country.country
        },
        citiesConnection: connections_1.connectionFromUrls('CountryCities', 'cities', city_1.default),
        id: graphql_relay_1.globalIdField('countries')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = CountryType;
