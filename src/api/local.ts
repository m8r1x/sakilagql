var apiData = require('./cachedData/cache');

// interface response { [key:string]: any }

export async function getFromLocalUrl(url: string)/* : Promise<response[] | response> */ {
    const text = apiData[url];
    if (!text) {
        throw new Error(`No entry in local cache for ${url}`);
    }
    if (process.env.NODE_ENV !== 'test') {
        console.log(`Hit the local cache for ${url}`);
    }
    return text;
}