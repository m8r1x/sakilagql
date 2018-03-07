import test from 'ava';
import { getFromLocalUrl } from '../local';

test.beforeEach(t => {
    t.context.baseUrl = 'http://localhost:8000/api';
});

test('Gets a film', async t => {
   const academyDino = await getFromLocalUrl(`${t.context.baseUrl}/films/1/`);
   t.is(academyDino.title, 'ACADEMY DINOSAUR');
});

test('Gets pages', async t => {
    const firstActors = await getFromLocalUrl(`${t.context.baseUrl}/actors/`);
    const secondActors = await getFromLocalUrl(`${t.context.baseUrl}/actors/?page=2`);
    t.is(firstActors.results.length, 30);
    t.is(secondActors.results.length, 30);
});

test('Gets first page by default', async t => {
    const customers = await getFromLocalUrl(`${t.context.baseUrl}/customers/`);
    t.is(customers['previous'], null);
});