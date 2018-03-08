import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllFilmProperties on Film {
          title
          description
          releaseYear
          length
          rating
          rentalRate
          rentalDuration
          rentalCost
          replacementCost
          originalLanguageID
          specialFeatures
          category { name }
          language { name }
          actorsConnection(first: 1) { edges { node { firstName } } }
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ film(filmID: 1) { title } }';
    const { data } = await api(query);
    t.is(data!['film']['title'], 'ACADEMY DINOSAUR');
});

test('Gets an object by global ID', async t => {
    const query = '{ film(filmID: 1) { id title } }';
    const { data } = await api(query);
    const nextQuery = `{ film(id: "${data!['film']['id']}") { id title } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['film']['title'], 'ACADEMY DINOSAUR');
    t.is(data!['film']['title'], nextResult.data!['film']['title']);
    t.is(data!['film']['id'], nextResult.data!['film']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ film(filmID: 1) { id title } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['film']['id']}") { 
            ... on Film { id title } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['film']['title'], 'ACADEMY DINOSAUR');
    t.is(data!['film']['title'], nextResult.data!['node']['title']);
    t.is(data!['film']['id'], nextResult.data!['node']['id']);
});
    
test('Gets all properties', async t => {
    const query = getDocument('{ film(filmID: 1) { ...AllFilmProperties } }');
    const { data } = await api(query);
    const expected = {
        title: 'ACADEMY DINOSAUR', 
        description: 'A Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies',
        releaseYear: 2006,
        length: 86, 
        rating: 'PG',
        rentalRate: 0.99,
        rentalDuration: 6,
        replacementCost: 20.99,
        rentalCost: null,
        originalLanguageID: null,
        specialFeatures: 'Deleted Scenes,Behind the Scenes',
        actorsConnection: {
            edges: [{ node: { firstName: 'PENELOPE' } }]
        },
        category: { name: 'Documentary'},
        language: { name: 'English' } 
    };
    t.deepEqual(data!['film'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allFilms { edges { node { ...AllFilmProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allFilms']['edges'].length, 1000);
});

test('Pagination query', async t => {
    const query = `{ allFilms(first: 2) { edges { cursor node { title } } } }`;
    const  { data } = await api(query);
    t.deepEqual(data!.allFilms.edges.map((e: {[key:string]: any}) => e.node.title), [
        'ACADEMY DINOSAUR',
        'ACE GOLDFINGER'
    ]);
    const nextCursor: string = data!.allFilms.edges[1].cursor;
    const nextQuery = `{
        allFilms(first: 2, after: "${nextCursor}") {
            edges { cursor node { title } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allFilms.edges.map((e: {[key:string]: any}) => e.node.title),[
        'ADAPTATION HOLES',
        'AFFAIR PREJUDICE'
    ]);
});