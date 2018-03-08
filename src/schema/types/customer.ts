import {
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
} from 'graphql';

import { nodeInterface } from '../relayNode';
import { globalIdField } from 'graphql-relay';
import AddressType from './address';
import { getObjectFromUrl } from '../apiHelper';

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        firstName: {
            type: GraphQLString,
            description: 'The customer\'s first name',
            resolve: customer => customer.first_name
        },
        lastName: {
            type: GraphQLString,
            description: 'The customer\'s last name',
            resolve: customer => customer.last_name
        },
        email: {
            type: GraphQLString,
            description: 'The customer\'s email address'
        },
        active: {
            type: GraphQLInt,
            description: ''
        },
        createdDate: {
            type: GraphQLString,
            description: 'The ISO 8601 date format of the time that this resource was created.',
            resolve: customer => customer.create_date
        },
        lastUpdate: {
            type: GraphQLString,
            description: 'The ISO 8601 date format of the time that this resource was created.',
            resolve: customer => customer.last_update
        },
        address: {
            type: AddressType,
            description: '',
            resolve: customer => {
                if (customer.address === null || customer.address === '' || customer.address === undefined) {
                    return null;
                }
                return getObjectFromUrl(customer.address);
            }
        },
        id: globalIdField('customers')
    }),
    interfaces: () => [nodeInterface]
});

export default CustomerType;