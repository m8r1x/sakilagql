import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllCategoryProperties on Category {
          name
          filmsConnection(first: 1) { edges { node { title } } }
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ category(categoryID: 1) { name } }';
    const { data } = await api(query);
    t.is(data!['category']['name'], 'Action');
});

test('Gets an object by global ID', async t => {
    const query = '{ category(categoryID: 1) { id name } }';
    const { data } = await api(query);
    const nextQuery = `{ category(id: "${data!['category']['id']}") { id name } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['category']['name'], 'Action');
    t.is(data!['category']['name'], nextResult.data!['category']['name']);
    t.is(data!['category']['id'], nextResult.data!['category']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ category(categoryID: 1) { id name } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['category']['id']}") { 
            ... on Category { id name } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['category']['name'], 'Action');
    t.is(data!['category']['name'], nextResult.data!['node']['name']);
    t.is(data!['category']['id'], nextResult.data!['node']['id']);
});

test('Gets all properties', async t => {
    const query = getDocument('{ category(categoryID: 1) { ...AllCategoryProperties } }');
    const { data } = await api(query);
    const expected = {
        name: 'Action',
        filmsConnection: {
            edges: [{ node: { title: 'AMADEUS HOLY'} }]
        }
    };
    t.deepEqual(data!['category'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allCategories { edges { node { ...AllCategoryProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allCategories']['edges'].length, 16);
});

test('Pagination query', async t => {
    const query = `{ allCategories(first: 2) { edges { cursor node { name } } } }`;
    const { data } = await api(query);
    t.deepEqual(data!.allCategories.edges.map((e: { [key: string]: any }) => e.node.name), [
        'Action',
        'Animation'
    ]);
    const nextCursor: string = data!.allCategories.edges[1].cursor;
    const nextQuery = `{
        allCategories(first: 2, after: "${nextCursor}") {
            edges { cursor node { name } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allCategories.edges.map((e: { [key: string]: any }) => e.node.name), [
        'Children',
        'Classics'
    ]);
});