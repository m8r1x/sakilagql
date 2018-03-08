import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllCityProperties on City {
          cityName
          country { countryName }
          addressConnection(first: 1) { edges { node { addressName } } }
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ city(cityID: 1) { cityName } }';
    const { data } = await api(query);
    t.is(data!['city']['cityName'], 'A Corua (La Corua)');
});

test('Gets an object by global ID', async t => {
    const query = '{ city(cityID: 1) { id cityName } }';
    const { data } = await api(query);
    const nextQuery = `{ city(id: "${data!['city']['id']}") { id cityName } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['city']['cityName'], 'A Corua (La Corua)');
    t.is(data!['city']['cityName'], nextResult.data!['city']['cityName']);
    t.is(data!['city']['id'], nextResult.data!['city']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ city(cityID: 1) { id cityName } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['city']['id']}") { 
            ... on City { id cityName } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['city']['cityName'], 'A Corua (La Corua)');
    t.is(data!['city']['cityName'], nextResult.data!['node']['cityName']);
    t.is(data!['city']['id'], nextResult.data!['node']['id']);
});

test('Gets all properties', async t => {
    const query = getDocument('{ city(cityID: 1) { ...AllCityProperties } }');
    const { data } = await api(query);
    const expected = {
        cityName: 'A Corua (La Corua)',
        country: {
            countryName: 'Spain'
        },
        addressConnection: {
            edges: [{ node: { addressName: '939 Probolinggo Loop'} }]
        }
    };
    t.deepEqual(data!['city'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allCities { edges { node { ...AllCityProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allCities']['edges'].length, 600);
});

test('Pagination query', async t => {
    const query = `{ allCities(first: 2) { edges { cursor node { cityName } } } }`;
    const { data } = await api(query);
    t.deepEqual(data!.allCities.edges.map((e: { [key: string]: any }) => e.node.cityName), [
        'A Corua (La Corua)',
        'Abha'
    ]);
    const nextCursor: string = data!.allCities.edges[1].cursor;
    const nextQuery = `{
        allCities(first: 2, after: "${nextCursor}") {
            edges { cursor node { cityName } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allCities.edges.map((e: { [key: string]: any }) => e.node.cityName), [
        'Abu Dhabi',
        'Acua'
    ]);
});