import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql';

import { nodeInterface } from '../relayNode';
import { globalIdField } from 'graphql-relay';
import { getObjectFromUrl } from '../apiHelper';
import CityType from './city';
import { connectionFromUrls } from '../connections';
import CustomerType from './customer';

const AddressType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Address',
    fields: () => ({
        addressName: {
            type: GraphQLString,
            description: '',
            resolve: address => address.address
        },
        address2: {
            type: GraphQLString,
            description: ''
        },
        disctrict: {
            type: GraphQLString,
            description: ''
        },
        phone: {
            type: GraphQLString,
            description: ''
        },
        postalCode: {
            type: GraphQLString,
            description: '',
            resolve: address => address.postal_code
        },
        city: {
            type: CityType,
            description: '',
            resolve: address => {
                if (address.city === null || address.city === '' || address.city === undefined) {
                    return null;
                }
                return getObjectFromUrl(address.city);
            }
        },
        customersConnection: connectionFromUrls('AddressCustomers', 'customers', CustomerType),
        id: globalIdField('addresses')
    }),
    interfaces: () => [nodeInterface]
});

export default AddressType;