import test from 'ava';
import { api } from './api';

function getDocument(query: string) {
    return `${query}
      fragment AllCustomerProperties on Customer {
          firstName
          lastName
          email
          active
          createdDate
          lastUpdate
          address { addressName }
      }
    `;
}

test('gets an object by api ID', async t => {
    const query = '{ customer(customerID: 1) { firstName } }';
    const { data } = await api(query);
    t.is(data!['customer']['firstName'], 'MARY');
});

test('Gets an object by global ID', async t => {
    const query = '{ customer(customerID: 1) { id firstName } }';
    const { data } = await api(query);
    const nextQuery = `{ customer(id: "${data!['customer']['id']}") { id firstName } }`;
    const nextResult = await api(nextQuery);
    t.is(data!['customer']['firstName'], 'MARY');
    t.is(data!['customer']['firstName'], nextResult.data!['customer']['firstName']);
    t.is(data!['customer']['id'], nextResult.data!['customer']['id']);
});

test('Gets an object by global ID with node', async t => {
    const query = '{ customer(customerID: 1) { id firstName } }';
    const { data } = await api(query);
    const nextQuery = `{
        node(id: "${data!['customer']['id']}") { 
            ... on Customer { id firstName } 
        }
    }`;
    const nextResult = await api(nextQuery);
    t.is(data!['customer']['firstName'], 'MARY');
    t.is(data!['customer']['firstName'], nextResult.data!['node']['firstName']);
    t.is(data!['customer']['id'], nextResult.data!['node']['id']);
});

test('Gets all properties', async t => {
    const query = getDocument('{ customer(customerID: 1) { ...AllCustomerProperties } }');
    const { data } = await api(query);
    const expected = {
        firstName: 'MARY',
        lastName: 'SMITH',
        email: 'MARY.SMITH@sakilacustomer.org',
        active: 1,
        createdDate: '2006-02-14T22:04:36Z',
        lastUpdate: '2006-02-15T04:57:20Z',
        address: { addressName: '1913 Hanoi Way' }
    };
    t.deepEqual(data!['customer'], expected);
});

test('all objects query', async t => {
    const query = getDocument('{ allCustomers { edges { node { ...AllCustomerProperties } } } }');
    const { data } = await api(query);
    t.is(data!['allCustomers']['edges'].length, 599);
});

test('Pagination query', async t => {
    const query = `{ allCustomers(first: 2) { edges { cursor node { firstName } } } }`;
    const { data } = await api(query);
    t.deepEqual(data!.allCustomers.edges.map((e: { [key: string]: any }) => e.node.firstName), [
        'MARY',
        'PATRICIA'
    ]);
    const nextCursor: string = data!.allCustomers.edges[1].cursor;
    const nextQuery = `{
        allCustomers(first: 2, after: "${nextCursor}") {
            edges { cursor node { firstName } }
        } 
    }`;
    const nextResult = await api(nextQuery);
    t.deepEqual(nextResult.data!.allCustomers.edges.map((e: { [key: string]: any }) => e.node.firstName), [
        'LINDA',
        'BARBARA'
    ]);
});