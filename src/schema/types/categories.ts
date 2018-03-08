import { GraphQLString, GraphQLObjectType } from 'graphql';

import { connectionFromUrls } from '../connections';
import { nodeInterface } from '../relayNode';

import FilmType from './films';
import { globalIdField } from 'graphql-relay';

const CategoryType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Category',
    description: 'A single category',
    fields: () => ({
        name: {
            type: GraphQLString
        },
        filmsConnection: connectionFromUrls('CategoryFilms', 'films', FilmType),
        id: globalIdField('categories')
    }),
    interfaces: () => [nodeInterface]
});

export default CategoryType;