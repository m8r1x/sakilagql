import { GraphQLObjectType } from 'graphql';
import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import { getObjectFromTypeAndId } from './apiHelper';

import FilmType from './types/films';
import ActorType from './types/actors';
import CategoryType from './types/categories';
import LanguageType from './types/language';
import CustomerType from './types/customer';
import AddressType from './types/address';
import CityType from './types/city';
import CountryType from './types/country';


export function apiTypeToGraphQLType(apiType:string): GraphQLObjectType {
    switch (apiType) {
        case 'films':
            return FilmType;
        case 'actors':
            return ActorType;
        case 'categories':
            return CategoryType;
        case 'languages':
            return LanguageType;
        case 'customers':
            return CustomerType;
        case 'addresses':
            return AddressType;
        case 'cities':
            return CityType;
        case 'countries':
            return CountryType;
        default:
            throw new Error(`Unrecognized type ${apiType}.`);
    }
}

const { nodeInterface, nodeField } = nodeDefinitions(
    globalId => {
        const { type, id } = fromGlobalId(globalId);
        return getObjectFromTypeAndId(type, id);
    },
    obj => {
        const parts: string[] = obj.url.split('/');
        return apiTypeToGraphQLType(parts[parts.length - 3]);
    }
);

export { nodeInterface, nodeField };