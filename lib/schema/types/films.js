"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const connections_1 = require("../connections");
const relayNode_1 = require("../relayNode");
const actors_1 = __importDefault(require("./actors"));
const categories_1 = __importDefault(require("./categories"));
const apiHelper_1 = require("../apiHelper");
const language_1 = __importDefault(require("./language"));
const FilmType = new graphql_1.GraphQLObjectType({
    name: 'Film',
    description: 'A single film',
    fields: () => ({
        title: {
            type: graphql_1.GraphQLString
        },
        description: {
            type: graphql_1.GraphQLString
        },
        releaseYear: {
            type: graphql_1.GraphQLInt,
            resolve: film => film.release_year
        },
        length: {
            type: graphql_1.GraphQLInt
        },
        rating: {
            type: graphql_1.GraphQLString
        },
        rentalRate: {
            type: graphql_1.GraphQLFloat,
            resolve: film => film.rental_rate
        },
        rentalDuration: {
            type: graphql_1.GraphQLInt,
            resolve: film => film.rental_duration
        },
        rentalCost: {
            type: graphql_1.GraphQLFloat,
            resolve: film => film.rental_cost
        },
        replacementCost: {
            type: graphql_1.GraphQLFloat,
            resolve: film => film.replacement_cost
        },
        originalLanguageID: {
            type: graphql_1.GraphQLString
        },
        specialFeatures: {
            type: graphql_1.GraphQLString,
            resolve: film => film.special_features
        },
        category: {
            type: categories_1.default,
            resolve: film => {
                if (!film.category_url) {
                    return null;
                }
                return apiHelper_1.getObjectFromUrl(film.category_url);
            }
        },
        language: {
            type: language_1.default,
            resolve: film => {
                if (!film.language_url) {
                    return null;
                }
                return apiHelper_1.getObjectFromUrl(film.language_url);
            }
        },
        actorsConnection: connections_1.connectionFromUrls('FilmActor', 'actors', actors_1.default),
        id: graphql_relay_1.globalIdField('films')
    }),
    interfaces: () => [relayNode_1.nodeInterface]
});
exports.default = FilmType;
