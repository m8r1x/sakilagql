import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql';
import { connectionFromUrls } from '../connections';

import FilmType from './films';
import { nodeInterface } from '../relayNode';
import { globalIdField } from 'graphql-relay';

const ActorType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Actor',
    fields: () => ({
        firstName: {
            type: GraphQLString,
            description: 'The employee\'s first name',
            resolve: actor => actor.first_name
        },
        lastName: {
            type: GraphQLString,
            description: 'The employee\'s last name',
            resolve: actor => actor.last_name
        },
        filmsConnection: connectionFromUrls('ActorFilm', 'films', FilmType),
        id: globalIdField('actors')
    }),
    interfaces: () => [nodeInterface]
});

export default ActorType;