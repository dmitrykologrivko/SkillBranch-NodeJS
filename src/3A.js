import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'

const PORT = 3000;

const app = express();

let pc = {};

async function fetchPc() {
    const PC_URL = 'https://gist.githubusercontent.com/isuvorov/ce6b8d87983611482aac89f6d7bc0037/raw/pc.json';
    try {
        const res = await fetch(PC_URL);
        pc = await res.json();
        console.log('PC json was loaded');
    } catch (err) {
        console.error(err);
    }
}

// Config express
app.use(cors());

// Setup routes
app.get('/volumes', (req, res) => {
    let sizes = new Map();
    // Check property HDD
    if (!pc.hdd) {
        res.status(404);
        return res.send('Not Found');
    }

    for (let i = 0; i < pc.hdd.length; i++) {
        const currentHdd = pc.hdd[i];
        // Check if current hdd already added in map
        if (sizes.has(currentHdd.volume)) {
            let size = sizes.get(currentHdd.volume);
            sizes.set(currentHdd.volume, size + currentHdd.size);
        } else {
            sizes.set(currentHdd.volume, currentHdd.size);
        }
    }

    // Create and format responce
    let responce = {};
    for (var [key, value] of sizes) {
        responce[key] = `${value}B`;
    }
    res.json(responce);
});

app.get('/*', (req, res) => {
    // Split URL by slash
    const properties = req.url.match(/[^/]+/g);

    // If the user does not pass parameters
    if (properties === null) {
        return res.json(pc);
    }

    let extractable = pc;
    // For all recived properties
    for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        // Check property
        if (Object.keys(extractable).indexOf(property) !== -1) {
            // Extract found property
            extractable = extractable[property];
        } else {
            res.status(404);
            return res.send('Not Found');
        }
    }

    res.json(extractable);
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
    // Fetch PC model after server was started
    fetchPc();
});