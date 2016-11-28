import express from 'express'
import cors from 'cors'

const PORT = 3000;

const app = express();

// Config express
app.use(cors());

// Setup routes
app.get('/', (req, res) => {
    const ERROR_MESSAGE = 'Invalid username';
    const VALIDATE_PATTERN = new RegExp(/@?(http:|https:)?(\/\/)?(www.)?([a-z0-9-.]*\/)?([a-zA-Z0-9.@_]*)/);

    let username = req.query.username;

    // Check username
    if (username === undefined) {
        res.send(ERROR_MESSAGE);
        return;
    }

    // Validate username
    if (!username.match(VALIDATE_PATTERN)) {
        res.send(ERROR_MESSAGE);
        return;
    }
    
    username = username.match(VALIDATE_PATTERN)[5];
    if (!username.includes('@')) {
        username = `@${username}`;
    }
    res.send(username);
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
});