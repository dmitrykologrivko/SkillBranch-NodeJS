import express from 'express'
import cors from 'cors'

const PORT = 3000;

// Load pokemons from JSON file
const pokemons = require('./pokemons.json');

// fat - max(pokemon.weight / pokemon.height)
// angular - min(pokemon.weight / pokemon.height)
// heavy - max(pokemon.weight)
// light - min(pokemon.weight)
// huge - max(pokemon.height)
// micro - min(pokemon.height)
// MAX parameter will be a negative number, and tend to zero when we will be sort
// MIN parameter will be without changes, and tend to zero when we will be sort
pokemons.forEach(p => {
    p.fat = -p.weight / +p.height;
    p.angular = +p.weight / +p.height;
    p.heavy = -p.weight;
    p.light = +p.weight;
    p.huge = -p.height;
    p.micro = +p.height;
});

function sortByTag(tag) {
    function nameComparator(a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    }

    function tagComparator(a, b) {
        return a[tag] < b[tag] ? -1 : a[tag] > b[tag] ? 1 : a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    }

    if (!tag) return;

    if (tag === 'name') {
        pokemons.sort(nameComparator);
    } else {
        pokemons.sort(tagComparator);
    }
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
app.get('/', (req, res) => {
    sortByTag('name');
    res.json(getOffset(+req.limit, +req.offset));
});

app.get('/:type', (req, res) => {
    const TAGS = [
        'fat',
        'angular',
        'heavy',
        'light',
        'huge',
        'micro'
    ];

    if (req.params && req.params.type && TAGS.includes(req.params.type)) {
        sortByTag(req.params.type);
    } else {
        sortByTag('name');
    }

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