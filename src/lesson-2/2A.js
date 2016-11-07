import express from 'express'
import cors from 'cors'

const PORT = 3000;

const app = express();

// Config express
app.use(cors());

// Setup routes
app.get('/', (req, res) => {
    // Define variables
    let a = 0;
    let b = 0;
    let c = 0;

    // Check query params
    if (req.query.a !== undefined) {
        a = parseInt(req.query.a);
    }
    if (req.query.b !== undefined) {
        b = parseInt(req.query.b);
    }

    // Calculate
    c = a + b;

    // Return to client
    res.send(c.toString());
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
});