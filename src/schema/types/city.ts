import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql';
import { nodeInterface } from '../relayNode';
import CountryType from './country';
import { getObjectFromUrl } from '../apiHelper';
import { globalIdField } from 'graphql-relay';
import { connectionFromUrls } from '../connections';
import AddressType from './address';

const CityType: GraphQLObjectType = new GraphQLObjectType({
    name: 'City',
    fields: () => ({
        cityName: {
            type: GraphQLString,
            resolve: city => city.city
        },
        country: {
            type: CountryType,
            resolve: city => {
                if (city.country === null || city.country === '' || city.country === undefined) {
                    return null;
                }
                return getObjectFromUrl(city.country);
            }
        },
        addressConnection: connectionFromUrls('CityAddress', 'addresses', AddressType),
        id: globalIdField('cities')
    }),
    interfaces: () => [nodeInterface]
});

export default CityType;