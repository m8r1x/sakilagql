"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = __importDefault(require("express-graphql"));
const schema_1 = __importDefault(require("../schema"));
const app = express_1.default();
app.all('/graphql', (req, res) => res.redirect('/'));
app.use('/', express_graphql_1.default(() => ({
    schema: schema_1.default,
    graphiql: true
})));
const listener = app.listen(process.env.PORT, () => {
    let host = listener.address().address;
    if (host === '::') {
        host = 'localhost';
    }
    const port = listener.address().port;
    console.log(`Listening at http://${host}:${port}`);
});
