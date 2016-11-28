import express from 'express'
import cors from 'cors'

const PORT = 3000;

// Load pokemons from JSON file
const pokemons = require('./pokemons.json');

function compareByKey(key) {
    return function compare(a, b) {
        return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }
}

function compareByName(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

const app = express();

// Config express
app.use(cors());
app.use((req, res, next) => {
    req.limit = req.query.limit || 20;
    req.offset = req.query.offset || 0;
    next();
});

// Setup routes
app.use((req, res, next) => {
    pokemons.forEach(p => {
        p.fat = -p.weight / +p.height;
        p.angular = +p.weight / +p.height;
        p.heavy = -p.weight;
        p.light = +p.weight;
        p.huge = -p.height;
        p.micro = +p.height;
    });
    next();
});

app.get(/^\/[^\/]*$/, (req, res) => {
    const Url = req.url.match(/^\/([^\/\?]*)(?:.*)/)[1];
    const ans = pokemons.sort(compareByKey(Url)).slice(req.offset, +req.offset + +req.limit);
    res.send(ans.map(value => {
        return value.name;
    }));
});

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.send('Not Found');
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
    next(err);
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
});