import {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLSchema
} from 'graphql';

import {
    fromGlobalId,
    connectionFromArray,
    connectionArgs,
    connectionDefinitions
} from 'graphql-relay';

import { nodeField, apiTypeToGraphQLType } from './relayNode';
import { getObjectFromTypeAndId, getObjectByType } from './apiHelper';

function rootFieldById(idName: string, apiType: string) {
    const getter = (id: string) => getObjectFromTypeAndId(apiType, id);
    const argsDef: {[key:string]: any}= {};
    argsDef.id = { type: GraphQLID };
    argsDef[idName] = { type: GraphQLID };
    return {
        type: apiTypeToGraphQLType(apiType),
        args: argsDef,
        resolve: (_: object, args: any) => {
            if (args[idName] !== undefined && args[idName] !== null) {
                return getter(args[idName].toString());
            }

            if (args.id !== undefined && args.id !== null) {
                const globalId = fromGlobalId(args.id.toString());
                if (globalId.id === null || globalId.id === undefined || globalId.id === '') {
                    throw new Error(`No valid Id extracted from ${args.id}`);
                }
                return getter(globalId.id);
            }
            throw new Error(`must provide id or ${idName}`);
        }
    };
}

function rootConnection(name: string, apiType: string) {
    const graphqlType = apiTypeToGraphQLType(apiType);
    const { connectionType } = connectionDefinitions({
        name,
        nodeType: graphqlType,
        connectionFields: () => ({
            totalCount: {
                type: GraphQLInt,
                resolve: conn => conn.totalCount,
                description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
            },
            [apiType]: {
                type: new GraphQLList(graphqlType),
                resolve: conn => conn.edges.map((edge: any) => edge.node),
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
        args: connectionArgs,
        resolve: async(_: any, args: object) => {
            const { objects, totalCount } = await getObjectByType(apiType);
            return { ...connectionFromArray(objects, args), totalCount };
        }
    };
}

const rootType = new GraphQLObjectType({
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
        node: nodeField
    })
});

export default new GraphQLSchema({ query: rootType });