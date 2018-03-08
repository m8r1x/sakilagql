import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllActorProperties on Actor {
          firstName
          lastName
          filmsConnection(first: 1) { edges { node { title } } }
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ actor(actorID: 1) { firstName } }';
    const { data } = await api(query);
    t.is(data!['actor']['firstName'], 'PENELOPE');
});

test('Gets an object by global ID', async t => {
    const query = '{ actor(actorID: 1) { id firstName } }';
    const { data } = await api(query);
    const nextQuery = `{ actor(id: "${data!['actor']['id']}") { id firstName } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['actor']['firstName'], 'PENELOPE');
    t.is(data!['actor']['firstName'], nextResult.data!['actor']['firstName']);
    t.is(data!['actor']['id'], nextResult.data!['actor']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ actor(actorID: 1) { id firstName } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['actor']['id']}") { 
            ... on Actor { id firstName } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['actor']['firstName'], 'PENELOPE');
    t.is(data!['actor']['firstName'], nextResult.data!['node']['firstName']);
    t.is(data!['actor']['id'], nextResult.data!['node']['id']);
});

test('Gets all properties', async t => {
    const query = getDocument('{ actor(actorID: 1) { ...AllActorProperties } }');
    const { data } = await api(query);
    const expected = {
        firstName: 'PENELOPE',
        lastName: 'GUINESS', 
        filmsConnection: {
            edges: [{ node: { title: 'ACADEMY DINOSAUR'} }]
        }
    };
    t.deepEqual(data!['actor'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allActors { edges { node { ...AllActorProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allActors']['edges'].length, 200);
});

test('Pagination query', async t => {
    const query = `{ allActors(first: 2) { edges { cursor node { firstName } } } }`;
    const { data } = await api(query);
    t.deepEqual(data!.allActors.edges.map((e: { [key: string]: any }) => e.node.firstName), [
        'PENELOPE',
        'NICK'
    ]);
    const nextCursor: string = data!.allActors.edges[1].cursor;
    const nextQuery = `{
        allActors(first: 2, after: "${nextCursor}") {
            edges { cursor node { firstName } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allActors.edges.map((e: { [key: string]: any }) => e.node.firstName), [
        'ED',
        'JENNIFER'
    ]);
});