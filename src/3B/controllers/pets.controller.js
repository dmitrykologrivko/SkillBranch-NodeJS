import {Pet} from '../models/pet'
import * as serializer from '../helpers/serializer'

export async function getAllPets(req, res, next) {
    try {
        const query = {};
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.age_gt) {
            query.age = {$gt: req.query.age_gt}
        }
        if (req.query.age_lt) {
            query.age = {$lt: req.query.age_lt}
        }
        if (req.query.age_gt && req.query.age_lt) {
            query.age = {$gt: req.query.age_gt, $lt: req.query.age_lt}
        }
        if (Object.values(req.params).includes('populate')) {
            const pets = await Pet.find(query).populate('user');
            return res.json(serializer.serializePetsPopulate(pets));
        }
        const pets = await Pet.find(query);
        return res.json(serializer.serializePets(pets));
    } catch (err) {
        return next(err);
    }
}

export async function getPetById(req, res, next) {
    try {
        if (Object.values(req.params).includes('/populate')) {
            const pet = await Pet.findOne({id: parseInt(req.params.id)}).populate('user');
            if (!pet) return next(); // Pass this on to 404 handler
            return res.json(serializer.serializePetPopulate(pet));
        }
        const pet = await Pet.findOne({id: parseInt(req.params.id)});
        if (!pet) return next(); // Pass this on to 404 handler
        res.json(serializer.serializePet(pet));
    } catch (err) {
        return next(err);
    }
}