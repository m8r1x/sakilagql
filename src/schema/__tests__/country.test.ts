import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllCountryProperties on Country {
          countryName
          citiesConnection(first: 1) { edges { node { cityName } } }
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ country(countryID: 1) { countryName } }';
    const { data } = await api(query);
    t.is(data!['country']['countryName'], 'Afghanistan');
});

test('Gets an object by global ID', async t => {
    const query = '{ country(countryID: 1) { id countryName } }';
    const { data } = await api(query);
    const nextQuery = `{ country(id: "${data!['country']['id']}") { id countryName } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['country']['countryName'], 'Afghanistan');
    t.is(data!['country']['countryName'], nextResult.data!['country']['countryName']);
    t.is(data!['country']['id'], nextResult.data!['country']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ country(countryID: 1) { id countryName } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['country']['id']}") { 
            ... on Country { id countryName } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['country']['countryName'], 'Afghanistan');
    t.is(data!['country']['countryName'], nextResult.data!['node']['countryName']);
    t.is(data!['country']['id'], nextResult.data!['node']['id']);
});

test('Gets all properties', async t => {
    const query = getDocument('{ country(countryID: 1) { ...AllCountryProperties } }');
    const { data } = await api(query);
    const expected = {
        countryName: 'Afghanistan',
        citiesConnection: {
            edges: [{ node: { cityName: 'Kabul' } }]
        }
    };
    t.deepEqual(data!['country'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allCountries { edges { node { ...AllCountryProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allCountries']['edges'].length, 109);
});

test('Pagination query', async t => {
    const query = `{ allCountries(first: 2) { edges { cursor node { countryName } } } }`;
    const { data } = await api(query);
    t.deepEqual(data!.allCountries.edges.map((e: { [key: string]: any }) => e.node.countryName), [
        'Afghanistan',
        'Algeria'
    ]);
    const nextCursor: string = data!.allCountries.edges[1].cursor;
    const nextQuery = `{
        allCountries(first: 2, after: "${nextCursor}") {
            edges { cursor node { countryName } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allCountries.edges.map((e: { [key: string]: any }) => e.node.countryName), [
        'American Samoa',
        'Angola'
    ]);
});