import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import usersRoute from './routes/users.route'
import petsRoute from './routes/pets.route'
import * as commonController from './controllers/common.controller'
import * as database from './helpers/database'
import * as network from './helpers/network'

const PORT = 3000;

const app = express();

// Config express
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Setup routes
app.get('/', commonController.root);
app.use('/users', usersRoute());
app.use('/pets', petsRoute());

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

async function prepareAndStartServer() {
    try {
        console.log('Connecting to MongoDB...');
        await database.connect();
        console.log('Clearing database...');
        await database.clearDatabase();
        console.log('Loading pets JSON structure...');
        const structure = await network.fetchPets();
        console.log('Adding users and their pets to the database...');
        await database.initDatabase(structure);
        console.log('Starting WEB server...');
        await app.listen(PORT);
        console.log(`Server was started on ${PORT} port`);
    } catch (err) {
        console.error(err);
    }
}

prepareAndStartServer();
