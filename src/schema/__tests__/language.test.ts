import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllLanguageProperties on Language {
          name
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ language(languageID: 1) { name } }';
    const { data } = await api(query);
    t.is(data!['language']['name'], 'English');
});

test('Gets an object by global ID', async t => {
    const query = '{ language(languageID: 1) { id name } }';
    const { data } = await api(query);
    const nextQuery = `{ language(id: "${data!['language']['id']}") { id name } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['language']['name'], 'English');
    t.is(data!['language']['name'], nextResult.data!['language']['name']);
    t.is(data!['language']['id'], nextResult.data!['language']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ language(languageID: 1) { id name } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['language']['id']}") { 
            ... on Language { id name } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['language']['name'], 'English');
    t.is(data!['language']['name'], nextResult.data!['node']['name']);
    t.is(data!['language']['id'], nextResult.data!['node']['id']);
});

test('Gets all properties', async t => {
    const query = getDocument('{ language(languageID: 1) { ...AllLanguageProperties } }');
    const { data } = await api(query);
    const expected = {
        name: 'English'
    };
    t.deepEqual(data!['language'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allLanguages { edges { node { ...AllLanguageProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allLanguages']['edges'].length, 6);
});

test('Pagination query', async t => {
    const query = `{ allLanguages(first: 2) { edges { cursor node { name } } } }`;
    const { data } = await api(query);
    t.deepEqual(data!.allLanguages.edges.map((e: { [key: string]: any }) => e.node.name), [
        'English',
        'Italian'
    ]);
    const nextCursor: string = data!.allLanguages.edges[1].cursor;
    const nextQuery = `{
        allLanguages(first: 2, after: "${nextCursor}") {
            edges { cursor node { name } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allLanguages.edges.map((e: { [key: string]: any }) => e.node.name), [
        'Japanese',
        'Mandarin'
    ]);
});