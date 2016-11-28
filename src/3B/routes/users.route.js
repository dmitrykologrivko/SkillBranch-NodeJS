import {Router} from 'express'
import * as usersController from '../controllers/users.controller'

export default () => {
    const router = new Router();

    router.get('/?(populate)?', usersController.getAllUsers);
    router.get('/(:identifier)?(/populate)?', usersController.getUserByIdentifier);
    router.get('/:identifier/pets', usersController.getUserPets);

    return router;
}

