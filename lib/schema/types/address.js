"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const relayNode_1 = require("../relayNode");
const graphql_relay_1 = require("graphql-relay");
const apiHelper_1 = require("../apiHelper");
const city_1 = __importDefault(require("./city"));
const connections_1 = require("../connections");
const customer_1 = __importDefault(require("./customer"));
const AddressType = new graphql_1.GraphQLObjectType({
    name: 'Address',
    fields: () => ({
        addressName: {
            type: graphql_1.GraphQLString,
            description: '',
            resolve: address => address.address
        },
        address2: {
            type: graphql_1.GraphQLString,
            description: ''
        },
        disctrict: {
            type: graphql_1.GraphQLString,
            description: ''
        },
        phone: {
            type: graphql_1.GraphQLString,
            description: ''
        },
        postalCode: {
            type: graphql_1.GraphQLString,
            description: '',
            resolve: address => address.postal_code
        },
        city: {
            type: city_1.default,
            description: '',
            resolve: address => {
                if (address.city === null || address.city === '' || address.city === undefined) {
                    return null;
                }
                return apiHelper_1.getObjectFromUrl(address.city);
            }
        },
        customersConnection: connections_1.connectionFromUrls('AddressCustomers', 'customers', customer_1.default),
        id: graphql_relay_1.globalIdField('addresses')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = AddressType;
