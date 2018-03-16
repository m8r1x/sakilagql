import { GraphQLFieldConfigArgumentMap } from 'graphql';
import { connectionArgs } from "graphql-relay";

let { GraphQLInputInt } = require('graphql-input-number');

const RequestLimit = GraphQLInputInt({
    name: 'RequestLimitInput',
    min: 1,
    max: 30,
    description: 'Resource limiting input. RANGE: 1-30'
});

const customConnectionArgs: GraphQLFieldConfigArgumentMap = {
    first: {
        type: RequestLimit
    },
    last: {
        type: RequestLimit
    }
};

export = { ...connectionArgs, ...customConnectionArgs };