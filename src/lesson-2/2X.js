import express from 'express'
import cors from 'cors'
import bigNumber from 'big-number'

const PORT = 80;

const app = express();

// Config express
app.use(cors());

// Setup routes
app.get('/', (req, res) => {
    let count = (n) => {
        if (n == 0) return 1;
        if (n == 1) return 6 * 3 * count(0);
        if (n == 2) return 6 * 2 * count(1) + 9 * 3 * count(0);
        return bigNumber(count(n - 1)).multiply(12).add(bigNumber(count(n - 2)).multiply(18));
    };

    let n = req.query.i;
    res.send(count(n).toString());
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server was started on ${PORT} port`);
});