import {User} from '../models/user'
import {Pet} from '../models/pet'
import * as serializer from '../helpers/serializer'

export async function getAllUsers(req, res, next) {
    try {
        if (Object.values(req.params).includes('populate')) {
            if (req.query.havePet) {
                const pets = await Pet.find({type: req.query.havePet}).select('_id');
                const users = await User.find({pets: {$in: pets}}).populate('pets');
                return res.json(serializer.serializeUsersPopulate(users));
            } else {
                const users = await User.find({}).populate('pets');
                return res.json(serializer.serializeUsersPopulate(users));
            }
        }
        if (req.query.havePet) {
            const pets = await Pet.find({type: req.query.havePet}).select('_id');
            const users = await User.find({pets: {$in: pets}});
            return res.json(serializer.serializeUsers(users));
        }
        const users = await User.find({});
        res.json(serializer.serializeUsers(users));
    } catch (err) {
        return next(err);
    }
}

export async function getUserByIdentifier(req, res, next) {
    try {
        const query = {};
        if (req.params.identifier.match(/^[0-9]+$/)) {
            query.id = parseInt(req.params.identifier);
        } else {
            query.username = req.params.identifier;
        }
        if (Object.values(req.params).includes('/populate')) {
            const user = await User.findOne(query).populate('pets');
            if (!user) return next(); // Pass this on to 404 handler
            return res.json(serializer.serializeUserPopulate(user));
        }
        const user = await User.findOne(query);
        if (!user) return next(); // Pass this on to 404 handler
        return res.json(serializer.serializeUser(user));
    } catch (err) {
        return next(err);
    }
}

export async function getUserPets(req, res, next) {
    try {
        const query = {};
        if (req.params.identifier.match(/^[0-9]+$/)) {
            query.id = parseInt(req.params.identifier);
        } else {
            query.username = req.params.identifier;
        }
        const user = await User.findOne(query).populate('pets');
        if (!user) return next(); // Pass this on to 404 handler
        res.json(serializer.serializePets(user.pets));
    } catch (err) {
        return next(err);
    }
}