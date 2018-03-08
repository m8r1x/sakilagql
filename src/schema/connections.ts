import {
    connectionFromArray,
    connectionArgs,
    connectionDefinitions
} from 'graphql-relay';

import {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLFieldConfig
} from 'graphql';
import { getObjectFromUrls } from './apiHelper';

export function connectionFromUrls(
    name: string,
    prop: string,
    type: GraphQLObjectType
): GraphQLFieldConfig<any, any> {
    const { connectionType } = connectionDefinitions({
        name,
        nodeType: type,
        resolveNode: edge => edge.node,
        connectionFields: () => ({
            totalCount: {
                type: GraphQLInt,
                resolve: conn => conn.totalCount,
                description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`
            },
            [prop]: {
                type: new GraphQLList(type),
                resolve: conn => conn.edges.map((edge: any) => edge.node),
                description: `A list of all of the objects returned in the connection. This is a convenience
field provided for quickly exploring the API; rather than querying for
"{ edges { node } }" when no edge data is needed, this field can be be used
instead. Note that when clients like Relay need to fetch the "cursor" field on
the edge to enable efficient pagination, this shortcut cannot be used, and the
full "{ edges { node } }" version should be used instead.`
            }
        })
    });
    return {
        type: connectionType,
        args: connectionArgs,
        resolve: async (obj, args) => {
            const array = await getObjectFromUrls(obj[prop] || []);
            return {
                ...connectionFromArray(array, args),
                totalCount: array.length
            };
        }
    };
}