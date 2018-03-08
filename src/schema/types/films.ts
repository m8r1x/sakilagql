import {
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLObjectType
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { connectionFromUrls } from '../connections';
import { nodeInterface } from '../relayNode';

import ActorType from './actors';
import CategoryType from './categories';
import { getObjectFromUrl } from '../apiHelper';
import LanguageType from './language';

const FilmType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Film',
    description: 'A single film',
    fields: () => ({
        title: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        releaseYear: {
            type: GraphQLInt,
            resolve: film => film.release_year
        },
        length: {
            type: GraphQLInt
        },
        rating: {
            type: GraphQLString
        },
        rentalRate: {
            type: GraphQLFloat,
            resolve: film => film.rental_rate
        },
        rentalDuration: {
            type: GraphQLInt,
            resolve: film => film.rental_duration
        },
        rentalCost: {
            type: GraphQLFloat,
            resolve: film => film.rental_cost
        },
        replacementCost: {
            type: GraphQLFloat,
            resolve: film => film.replacement_cost
        },
        originalLanguageID: {
            type: GraphQLString
        },
        specialFeatures: {
            type: GraphQLString,
            resolve: film => film.special_features
        },
        category: {
            type: CategoryType,
            resolve: film => {
                if (!film.category_url) {
                    return null;
                }
                return getObjectFromUrl(film.category_url);
            }
        },
        language: {
            type: LanguageType,
            resolve: film => {
                if (!film.language_url) {
                    return null;
                }
                return getObjectFromUrl(film.language_url);
            }
        },
        actorsConnection: connectionFromUrls('FilmActor', 'actors', ActorType),
        id: globalIdField('films')
    }),
    interfaces: () => [nodeInterface]
});

export default FilmType;