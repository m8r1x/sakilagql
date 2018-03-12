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
const graphql_relay_1 = require("graphql-relay");
const graphql_1 = require("graphql");
const apiHelper_1 = require("./apiHelper");
function connectionFromUrls(name, prop, type) {
    const { connectionType } = graphql_relay_1.connectionDefinitions({
        name,
        nodeType: type,
        resolveNode: edge => edge.node,
        connectionFields: () => ({
            totalCount: {
                type: graphql_1.GraphQLInt,
                resolve: conn => conn.totalCount,
                description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`
            },
            [prop]: {
                type: new graphql_1.GraphQLList(type),
                resolve: conn => conn.edges.map((edge) => edge.node),
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
        args: graphql_relay_1.connectionArgs,
        resolve: (obj, args) => __awaiter(this, void 0, void 0, function* () {
            const array = yield apiHelper_1.getObjectFromUrls(obj[prop] || []);
            return Object.assign({}, graphql_relay_1.connectionFromArray(array, args), { totalCount: array.length });
        })
    };
}
exports.connectionFromUrls = connectionFromUrls;
