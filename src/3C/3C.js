import express from 'express'
import cors from 'cors'

const PORT = 3000;

// Load pokemons from JSON file
const pokemons = require('./pokemons.json');

const TAGS = [
    'fat',
    'angular',
    'heavy',
    'light',
    'huge',
    'micro'
];

function sortByTag(tag = 'name') {
    function nameComparator(a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    }

    // fat - max(pokemon.weight / pokemon.height)
    function fatComparator(a, b) {
        if (a.height === 0 || b.height === 0) return;
        return a.weight / a.height < b.weight / b.height ? 1 : a.weight / a.height > b.weight / b.height ? -1
            : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    // angular - min(pokemon.weight / pokemon.height)
    function angularComparator(a, b) {
        if (a.height === 0 || b.height === 0) return;
        return a.weight / a.height < b.weight / b.height ? -1 : a.weight / a.height > b.weight / b.height ? 1
            : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    // heavy - max(pokemon.weight)
    function heavyComparator(a, b) {
        return a.weight < b.weight ? 1 : a.weight > b.weight ? -1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    // light - min(pokemon.weight)
    function lightComparator(a, b) {
        return a.weight < b.weight ? -1 : a.weight > b.weight ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    // huge - max(pokemon.height)
    function hugeComparator(a, b) {
        return a.height < b.height ? 1 : a.height > b.height ? -1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    // micro - min(pokemon.height)
    function microComparator(a, b) {
        return a.height < b.height ? -1 : a.height > b.height ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    if (tag === 'name') pokemons.sort(nameComparator);
    if (tag === 'fat') pokemons.sort(fatComparator);
    if (tag === 'angular') pokemons.sort(angularComparator);
    if (tag === 'heavy') pokemons.sort(heavyComparator);
    if (tag === 'light') pokemons.sort(lightComparator);
    if (tag === 'huge') pokemons.sort(hugeComparator);
    if (tag === 'micro') pokemons.sort(microComparator);
}

function getOffset(limit, offset) {
    return pokemons.slice(offset, offset + limit).map(pokemon => {
        return pokemon.name;
    });
}

const app = express();

// Config express
app.use(cors());

// Setup middlewares
app.use((req, res, next) => {
    req.limit = req.query.limit || 20;
    req.offset = req.query.offset || 0;
    next();
});

// Setup routes
app.get('/?(:type)?', (req, res) => {
    sortByTag(req.params.type);
    res.json(getOffset(+req.limit, +req.offset));
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