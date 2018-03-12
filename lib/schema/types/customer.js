"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const relayNode_1 = require("../relayNode");
const graphql_relay_1 = require("graphql-relay");
const address_1 = __importDefault(require("./address"));
const apiHelper_1 = require("../apiHelper");
const CustomerType = new graphql_1.GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        firstName: {
            type: graphql_1.GraphQLString,
            description: 'The customer\'s first name',
            resolve: customer => customer.first_name
        },
        lastName: {
            type: graphql_1.GraphQLString,
            description: 'The customer\'s last name',
            resolve: customer => customer.last_name
        },
        email: {
            type: graphql_1.GraphQLString,
            description: 'The customer\'s email address'
        },
        active: {
            type: graphql_1.GraphQLInt,
            description: ''
        },
        createdDate: {
            type: graphql_1.GraphQLString,
            description: 'The ISO 8601 date format of the time that this resource was created.',
            resolve: customer => customer.create_date
        },
        lastUpdate: {
            type: graphql_1.GraphQLString,
            description: 'The ISO 8601 date format of the time that this resource was created.',
            resolve: customer => customer.last_update
        },
        address: {
            type: address_1.default,
            description: '',
            resolve: customer => {
                if (customer.address === null || customer.address === '' || customer.address === undefined) {
                    return null;
                }
                return apiHelper_1.getObjectFromUrl(customer.address);
            }
        },
        id: graphql_relay_1.globalIdField('customers')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = CustomerType;
