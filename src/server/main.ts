import express from 'express';
import graphqlHTTP from 'express-graphql';

let depthLimit = require('graphql-depth-limit');

import apiSchema from '../schema';

const app = express();

app.all('/graphql', (req, res) => res.redirect('/'))

app.use('/', graphqlHTTP(() => ({
    schema: apiSchema,
    graphiql: true,
    validationRules: [depthLimit(10)]
})));

const listener = app.listen(3000, () => {
    let host = listener.address().address;
    if (host === '::') {
        host = 'localhost';
    }
    const port = listener.address().port;
    console.log(`Listening at http://${host}:${port}`);
});