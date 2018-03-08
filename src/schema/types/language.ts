import { GraphQLString, GraphQLObjectType } from 'graphql';
import { nodeInterface } from '../relayNode';
import { globalIdField } from 'graphql-relay';

const LanguageType = new GraphQLObjectType({
    name: 'Language',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        id: globalIdField('languages')
    }),
    interfaces: () => [nodeInterface]
});

export default LanguageType;