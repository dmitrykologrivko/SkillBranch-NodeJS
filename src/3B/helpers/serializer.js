export function serializeUser(user) {
    return {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        password: user.password,
        values: user.values
    };
}

export function serializeUsers(users) {
    return users.map(user => {
        return serializeUser(user)
    });
}

export function serializeUserPopulate(user) {
    return {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        password: user.password,
        values: user.values,
        pets: serializePets(user.pets)
    };
}

export function serializeUsersPopulate(users) {
    return users.map(user => {
        return serializeUserPopulate(user)
    });
}

export function serializePet(pet) {
    return {
        id: pet.id,
        userId: pet.userId,
        type: pet.type,
        color: pet.color,
        age: pet.age
    };
}

export function serializePets(pets) {
    return pets.map(pet => {
        return serializePet(pet)
    });
}

export function serializePetPopulate(pet) {
    return {
        id: pet.id,
        userId: pet.userId,
        type: pet.type,
        color: pet.color,
        age: pet.age,
        user: serializeUser(pet.user)
    };
}

export function serializePetsPopulate(pets) {
    return pets.map(pet => {
        return serializePetPopulate(pet)
    });
}