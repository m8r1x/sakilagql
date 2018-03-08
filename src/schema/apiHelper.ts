import DataLoader from 'dataloader';
import fetch from 'isomorphic-fetch';

import { getFromLocalUrl } from '../api';

const localUrlLoader = new DataLoader((urls: string[]): Promise<object[]> =>
    Promise.all(urls.map(getFromLocalUrl))
);

function objectWithId(obj: {[key:string]: any}): {[key:string]: any} {
    obj.id = parseInt(obj.url.split('/')[5], 10);
    return obj;
}

export async function getObjectFromUrl(url: string): Promise<{[key:string]: any}> {
    const data = await localUrlLoader.load(url)
    return objectWithId(data);
}

export async function getObjectFromTypeAndId(type: string, id: string): Promise<{[key:string]: any}> {
    return await getObjectFromUrl(`http://localhost:8000/api/${type}/${id}/`);
}

interface ObjectsByType {
    objects: object[]
    totalCount: number
}

export async function getObjectByType(type: string): Promise<ObjectsByType> {
    let objects: object[] = [];
    let nextUrl = `http://localhost:8000/api/${type}/`;
    while (nextUrl) {
        const pageData: {[key:string]: any} = await localUrlLoader.load(nextUrl);
        objects = objects.concat(pageData.results.map(objectWithId));
        nextUrl = pageData.next;
    }
    objects = sortObjectsById(objects);
    return { objects, totalCount: objects.length };
}

export async function getObjectFromUrls(urls: string[]): Promise<object[]> {
    const array = await Promise.all(urls.map(getObjectFromUrl));
    return sortObjectsById(array);
}

function sortObjectsById(array: any[]): object[] {
    return array.sort((a,b) => a.id - b.id);
}

export function convertToNumber(value: string): number | null {
    if (['unknown', 'n/a'].indexOf(value) !== -1) {
        return null;
    }
    const numberString = value.replace(/,/, '');
    return Number(numberString);
}