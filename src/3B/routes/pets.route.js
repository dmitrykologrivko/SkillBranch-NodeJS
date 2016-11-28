import {Router} from 'express'
import * as petsController from '../controllers/pets.controller'

export default () => {
    const pets = new Router();

    pets.get('/?(populate)?', petsController.getAllPets);
    pets.get('/(:id([-\\d]+))?(/populate)?', petsController.getPetById);

    return pets;
}
