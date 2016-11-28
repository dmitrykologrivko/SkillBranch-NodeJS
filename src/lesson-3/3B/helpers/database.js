import mongoose from 'mongoose'
import {User} from '../models/user'
import {Pet} from '../models/pet'

const DATABASE_URI = 'mongodb://localhost:27017/punk_pets_hair';

// Config mongoose
mongoose.Promise = global.Promise;

export async function connect() {
    await mongoose.connect(DATABASE_URI);
}

export async function clearDatabase() {
    await User.remove({});
    await Pet.remove({});
}

export async function initDatabase(structure) {
    if (!structure) throw new Error('Pets structure required');
    // Get users
    const users = structure.users;
    // For each user
    for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];
        const user = new User({
            id: currentUser.id,
            username: currentUser.username,
            fullname: currentUser.fullname,
            password: currentUser.password,
            values: {
                money: currentUser.values.money,
                origin: currentUser.values.origin
            }
        });
        // Save current user to database
        await user.save();
    }
    // Get pets
    const pets = structure.pets;
    // For each pet
    for (let i = 0; i < pets.length; i++) {
        const currentPet = pets[i];
        const petOwner = await User.findOne({id: currentPet.userId});
        const pet = new Pet({
            id: currentPet.id,
            userId: currentPet.userId,
            user: petOwner,
            type: currentPet.type,
            color: currentPet.color,
            age: currentPet.age
        });
        petOwner.pets.push(pet);
        // Save current pet to database
        await pet.save();
        // Update current pet owner
        await petOwner.save();
    }
}