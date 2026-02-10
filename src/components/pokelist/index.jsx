import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PokeCard from "../pokeCard";

const PokeList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [order, setOrder] = useState("asc");

    useEffect(() => {
        setLoading(true);
        const query =
            `${search ? `&name=${encodeURIComponent(search)}` : ""}` +
            `${typeFilter ? `&type=${encodeURIComponent(typeFilter)}` : ""}` +
            `&sortBy=${encodeURIComponent(sortBy)}&order=${encodeURIComponent(order)}`;
        fetch(`http://localhost:3000/pokemons?limit=20&page=${page}${query}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Donnees recues:", data);
                setPokemons(data.data || []);
                setTotalPages(data.totalPages || 1);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Erreur:", error);
                setLoading(false);
            });
    }, [page, search, typeFilter, sortBy, order]);

    return (
        <div className="list-page">
            <div className="list-header">
                <div>
                    <h2 className="list-title">Pokedex</h2>
                    <p className="list-subtitle">Choisis un Pokemon, filtre par type ou trie par stats.</p>
                </div>
            </div>
            <div className="filters">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Recherche par nom"
                />
                <select
                    value={typeFilter}
                    onChange={(e) => {
                        setTypeFilter(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="">Tous les types</option>
                    <option value="Bug">Bug</option>
                    <option value="Dark">Dark</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Electric">Electric</option>
                    <option value="Fairy">Fairy</option>
                    <option value="Fighting">Fighting</option>
                    <option value="Fire">Fire</option>
                    <option value="Flying">Flying</option>
                    <option value="Ghost">Ghost</option>
                    <option value="Grass">Grass</option>
                    <option value="Ground">Ground</option>
                    <option value="Ice">Ice</option>
                    <option value="Normal">Normal</option>
                    <option value="Poison">Poison</option>
                    <option value="Psychic">Psychic</option>
                    <option value="Rock">Rock</option>
                    <option value="Steel">Steel</option>
                    <option value="Water">Water</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="id">Trier par ID</option>
                    <option value="name">Trier par Nom</option>
                    <option value="hp">Trier par HP</option>
                    <option value="attack">Trier par Attack</option>
                    <option value="defense">Trier par Defense</option>
                    <option value="speed">Trier par Speed</option>
                </select>
                <select
                    value={order}
                    onChange={(e) => {
                        setOrder(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="asc">Ascendant</option>
                    <option value="desc">Descendant</option>
                </select>
            </div>
            {loading && <p className="loading">Chargement...</p>}
            <div className="pagination-top">
                <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                >
                    Precedent
                </button>
                <span>{page} / {totalPages}</span>
                <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                >
                    Suivant
                </button>
            </div>
            <ul className="card-grid">
                {pokemons.map((pokemon) => (
                    <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`} className="card-link">
                        <PokeCard pokemon={pokemon} />
                    </Link>
                ))}
            </ul>
            <div className="pagination-bar">
                <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                >
                    Precedent
                </button>
                <span>{page} / {totalPages}</span>
                <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default PokeList;
