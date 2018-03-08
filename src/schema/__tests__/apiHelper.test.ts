import test from 'ava';
import {
    getObjectFromUrl,
    getObjectByType,
    getObjectFromTypeAndId
} from '../apiHelper';

const error = (resource: string) => Promise.reject(new Error(`No entry in local cache for http://localhost:8000/api/${resource}`));

test.beforeEach(t => {
    t.context.baseUrl = 'http://localhost:8000/api';
});

test('Gets a film category', async t => {
    const action = await getObjectFromUrl(`${t.context.baseUrl}/categories/1/`);
    t.is(action['name'], 'Action');
});

test('Gets all pages at once', async t => {
    const { objects, totalCount } = await getObjectByType('customers');
    t.is(objects.length, 599);
    t.is(totalCount, 599);
});

test('Gets a category by ID', async t => {
    const animation = await getObjectFromTypeAndId('categories', '2');
    t.is(animation['name'], 'Animation');
});
