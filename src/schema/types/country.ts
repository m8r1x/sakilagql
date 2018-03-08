import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql';
import { nodeInterface } from '../relayNode';
import { globalIdField } from 'graphql-relay';
import { connectionFromUrls } from '../connections';
import CityType from './city';

const CountryType = new GraphQLObjectType({
    name: 'Country',
    fields: () => ({
        countryName: {
            type: GraphQLString,
            resolve: country => country.country
        },
        citiesConnection: connectionFromUrls('CountryCities', 'cities', CityType),
        id: globalIdField('countries')
    }),
    interfaces: () => [nodeInterface]
});

export default CountryType;