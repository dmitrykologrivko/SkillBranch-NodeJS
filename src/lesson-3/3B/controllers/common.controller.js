import {User} from '../models/user'
import {Pet} from '../models/pet'
import * as serializer from '../helpers/serializer'

export async function root(req, res, next) {
    try {
        const users = await User.find({});
        const pets = await Pet.find({});
        res.json({
            users: serializer.serializeUsers(users),
            pets: serializer.serializePets(pets)
        });
    } catch (err) {
        return next(err);
    }
}