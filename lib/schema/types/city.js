"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const relayNode_1 = require("../relayNode");
const country_1 = __importDefault(require("./country"));
const apiHelper_1 = require("../apiHelper");
const graphql_relay_1 = require("graphql-relay");
const connections_1 = require("../connections");
const address_1 = __importDefault(require("./address"));
const CityType = new graphql_1.GraphQLObjectType({
    name: 'City',
    fields: () => ({
        cityName: {
            type: graphql_1.GraphQLString,
            resolve: city => city.city
        },
        country: {
            type: country_1.default,
            resolve: city => {
                if (city.country === null || city.country === '' || city.country === undefined) {
                    return null;
                }
                return apiHelper_1.getObjectFromUrl(city.country);
            }
        },
        addressConnection: connections_1.connectionFromUrls('CityAddress', 'addresses', address_1.default),
        id: graphql_relay_1.globalIdField('cities')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = CityType;
