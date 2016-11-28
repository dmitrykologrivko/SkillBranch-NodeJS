import fetch from 'node-fetch'

export async function fetchPets() {
    const PETS_URL = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';
    const res = await fetch(PETS_URL);
    return await res.json();
}