import test from 'ava';
import apiSchema from '../';
import { graphql } from 'graphql';

test('gets an error when ID is omitted', async t => {
    const query = '{ film { title } }';
    const { data, errors } = await graphql(apiSchema, query);
    t.is(errors!.length, 1);
    t.is(errors![0].message, 'must provide id or filmID');
    t.deepEqual(data, { film: null });
});

test('gets an error when global ID is invalid', async t => {
    const query = '{ film(id: "notanid") { title } }';
    const { data, errors } = await graphql(apiSchema, query);
    t.is(errors!.length, 1);
    t.true(errors![0].message.includes('No entry in local cache for'));
    t.deepEqual(data, { film: null });
});