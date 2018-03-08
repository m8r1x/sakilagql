import test from 'ava';
import apiSchema from '../';
import { graphql } from 'graphql';

test('Makes AVA stop complaining', t => {
    t.pass('NO TEST HERE!');
});

export async function api(query: string) {
    const result = await graphql(apiSchema, query);
    if (result.errors !== undefined) {
        throw new Error(JSON.stringify(result.errors, null, 2));
    }
    return result;
}
