"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const relayNode_1 = require("./relayNode");
const apiHelper_1 = require("./apiHelper");
function rootFieldById(idName, apiType) {
    const getter = (id) => apiHelper_1.getObjectFromTypeAndId(apiType, id);
    const argsDef = {};
    argsDef.id = { type: graphql_1.GraphQLID };
    argsDef[idName] = { type: graphql_1.GraphQLID };
    return {
        type: relayNode_1.apiTypeToGraphQLType(apiType),
        args: argsDef,
        resolve: (_, args) => {
            if (args[idName] !== undefined && args[idName] !== null) {
                return getter(args[idName].toString());
            }
            if (args.id !== undefined && args.id !== null) {
                const globalId = graphql_relay_1.fromGlobalId(args.id.toString());
                if (globalId.id === null || globalId.id === undefined || globalId.id === '') {
                    throw new Error(`No valid Id extracted from ${args.id}`);
                }
                return getter(globalId.id);
            }
            throw new Error(`must provide id or ${idName}`);
        }
    };
}
function rootConnection(name, apiType) {
    const graphqlType = relayNode_1.apiTypeToGraphQLType(apiType);
    const { connectionType } = graphql_relay_1.connectionDefinitions({
        name,
        nodeType: graphqlType,
        connectionFields: () => ({
            totalCount: {
                type: graphql_1.GraphQLInt,
                resolve: conn => conn.totalCount,
                description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
            },
            [apiType]: {
                type: new graphql_1.GraphQLList(graphqlType),
                resolve: conn => conn.edges.map((edge) => edge.node),
                description: `A list of all of the objects returned in the connection. This is a convenience
field provided for quickly exploring the API; rather than querying for
"{ edges { node } }" when no edge data is needed, this field can be be used
instead. Note that when clients like Relay need to fetch the "cursor" field on
the edge to enable efficient pagination, this shortcut cannot be used, and the
full "{ edges { node } }" version should be used instead.`,
            },
        })
    });
    return {
        type: connectionType,
        args: graphql_relay_1.connectionArgs,
        resolve: (_, args) => __awaiter(this, void 0, void 0, function* () {
            const { objects, totalCount } = yield apiHelper_1.getObjectByType(apiType);
            return Object.assign({}, graphql_relay_1.connectionFromArray(objects, args), { totalCount });
        })
    };
}
const rootType = new graphql_1.GraphQLObjectType({
    name: 'Root',
    fields: () => ({
        allFilms: rootConnection('Films', 'films'),
        film: rootFieldById('filmID', 'films'),
        allActors: rootConnection('Actors', 'actors'),
        actor: rootFieldById('actorID', 'actors'),
        allCategories: rootConnection('Categories', 'categories'),
        category: rootFieldById('categoryID', 'categories'),
        allLanguages: rootConnection('Languages', 'languages'),
        language: rootFieldById('languageID', 'languages'),
        allCustomers: rootConnection('Customers', 'customers'),
        customer: rootFieldById('customerID', 'customers'),
        allAddresses: rootConnection('Addresses', 'addresses'),
        address: rootFieldById('addressID', 'addresses'),
        allCountries: rootConnection('Countries', 'countries'),
        country: rootFieldById('countryID', 'countries'),
        allCities: rootConnection('Cities', 'cities'),
        city: rootFieldById('cityID', 'cities'),
        node: relayNode_1.nodeField
    })
});
exports.default = new graphql_1.GraphQLSchema({ query: rootType });
