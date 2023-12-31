import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Pokemon {
    id: number;
    name: string;
    abilities: string[];
    stats: Record<string, number>;
    type: string;
    image: string;
}

const PokemonSearch: React.FC = () => {
    const [pokemonName, setPokemonName] = useState<string>('');
    const [pokemonData, setPokemonData] = useState<Pokemon | null>(null);
    const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const searchPokemon = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get<Pokemon>(`http://localhost:8080/api/v2/pokemon/${pokemonName}`);
            setPokemonData(res.data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(JSON.stringify(err));
            }
        }
        setIsLoading(false);
    };
    


    const savePokemon = async () => {
        if (pokemonData) {
            try {
                const res = await axios.post(`http://localhost:8080/api/v2/pokemon/favourites/${pokemonData.name}`);
                const savedPokemon = res.data;
                setFavoritePokemons([...favoritePokemons, savedPokemon]);
            } catch (err) {
                console.error(err);
            }
        }
};


    const fetchFavoritePokemons = async () => {
        const response = await axios.get<Pokemon[]>('http://localhost:8080/api/v2/pokemon/favourites');
        setFavoritePokemons(response.data);
    };

    useEffect(() => {
        fetchFavoritePokemons();
    }, []);


    const deleteFavoritePokemon = async (pokemonId: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/v2/pokemon/favourites/${pokemonId}`);
            console.log(pokemonId);
            fetchFavoritePokemons();  
        } catch (error) {
            console.error(error);
        }
};


    return (
        <div>
            <input value={pokemonName} onChange={e => setPokemonName(e.target.value)} />
            <button onClick={searchPokemon}>Search</button>
            {isLoading && <div>Loading Pokedex...</div>}
            {error && <div>Error: {error}</div>}
            {pokemonData && (
                <div>
                    <h1>{pokemonData.name}</h1>
                    <img src={pokemonData.image} alt={pokemonData.name} />
                    <p>Type: {pokemonData.type}</p>
                    <p>Abilities: {pokemonData.abilities.join(', ')}</p>
                    <p>Health: {pokemonData.stats["hp"]}</p>
                    <p>Attack: {pokemonData.stats["attack"]}</p>
                    <p>Defense: {pokemonData.stats["defense"]}</p>
                    <p>Speed: {pokemonData.stats["speed"]}</p>
                    <button onClick={savePokemon}>Save</button>
                </div>
            )}
            <div>
                <h2>Favourite Pokemons:</h2>
                {favoritePokemons.map((pokemon, index) => (
                    <div key={index}>
                        <h1>{pokemon.name}</h1>
                        <img src={pokemon.image} alt={pokemon.name} />
                        <p>Type: {pokemon.type}</p>
                        <p>Abilities: {pokemon.abilities.join(', ')}</p>
                        <p>Health: {pokemon.stats["hp"]}</p>
                        <p>Attack: {pokemon.stats["attack"]}</p>
                        <p>Defense: {pokemon.stats["defense"]}</p>
                        <p>Speed: {pokemon.stats["speed"]}</p>
                        <button onClick={() => deleteFavoritePokemon(pokemon.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PokemonSearch;
