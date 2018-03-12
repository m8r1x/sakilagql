"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_relay_1 = require("graphql-relay");
const apiHelper_1 = require("./apiHelper");
const films_1 = __importDefault(require("./types/films"));
const actors_1 = __importDefault(require("./types/actors"));
const categories_1 = __importDefault(require("./types/categories"));
const language_1 = __importDefault(require("./types/language"));
const customer_1 = __importDefault(require("./types/customer"));
const address_1 = __importDefault(require("./types/address"));
const city_1 = __importDefault(require("./types/city"));
const country_1 = __importDefault(require("./types/country"));
function apiTypeToGraphQLType(apiType) {
    switch (apiType) {
        case 'films':
            return films_1.default;
        case 'actors':
            return actors_1.default;
        case 'categories':
            return categories_1.default;
        case 'languages':
            return language_1.default;
        case 'customers':
            return customer_1.default;
        case 'addresses':
            return address_1.default;
        case 'cities':
            return city_1.default;
        case 'countries':
            return country_1.default;
        default:
            throw new Error(`Unrecognized type ${apiType}.`);
    }
}
exports.apiTypeToGraphQLType = apiTypeToGraphQLType;
const { nodeInterface, nodeField } = graphql_relay_1.nodeDefinitions(globalId => {
    const { type, id } = graphql_relay_1.fromGlobalId(globalId);
    return apiHelper_1.getObjectFromTypeAndId(type, id);
}, obj => {
    const parts = obj.url.split('/');
    return apiTypeToGraphQLType(parts[parts.length - 3]);
});
exports.nodeInterface = nodeInterface;
exports.nodeField = nodeField;
