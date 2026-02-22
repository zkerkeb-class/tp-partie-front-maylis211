import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const typeGradients = {
  fire: ["#ff9a3c", "#ff3d3d"],
  water: ["#6ec6ff", "#3b6cff"],
  grass: ["#6bd36b", "#2f8f4e"],
  electric: ["#ffe066", "#f1c40f"],
  psychic: ["#ff7eb3", "#ff3d7f"],
  bug: ["#b6e35b", "#7cb342"],
  normal: ["#d6d6d6", "#a5a5a5"],
  dark: ["#4b5563", "#111827"],
  fairy: ["#f6b3ff", "#ff7ac7"],
  dragon: ["#7c83ff", "#4b22ff"],
  ice: ["#b2f5ff", "#5ed3ff"],
  fighting: ["#ffb36b", "#d35400"],
  flying: ["#b8c6ff", "#6b87ff"],
  rock: ["#c4b58e", "#8d7b4f"],
  ground: ["#e6c97b", "#b58a3a"],
  poison: ["#c084fc", "#7c3aed"],
  steel: ["#c7d2fe", "#94a3b8"],
  ghost: ["#8b7dd8", "#4b2f99"],
};

const PokemonDetail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/pokemons/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pokemon not found");
        return res.json();
      })
      .then((data) => {
        setPokemon(data);
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!pokemon) return <p>Pokemon introuvable.</p>;

  const mainType = pokemon.type?.[0]?.toLowerCase() || "normal";
  const [g1, g2] = typeGradients[mainType] || ["#e5e7eb", "#9ca3af"];
  const stats = [
    { label: "HP", value: Number(pokemon.base?.HP ?? 0) },
    { label: "Attack", value: Number(pokemon.base?.Attack ?? 0) },
    { label: "Defense", value: Number(pokemon.base?.Defense ?? 0) },
    { label: "Sp. Atk", value: Number(pokemon.base?.SpecialAttack ?? 0) },
    { label: "Sp. Def", value: Number(pokemon.base?.SpecialDefense ?? 0) },
    { label: "Speed", value: Number(pokemon.base?.Speed ?? 0) },
  ];
  const maxStat = Math.max(200, ...stats.map((s) => s.value));
  const center = { x: 200, y: 200 };
  const radius = 150;
  const step = (Math.PI * 2) / stats.length;

  const point = (value, index) => {
    const ratio = value / maxStat;
    const angle = -Math.PI / 2 + step * index;
    const r = radius * ratio;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    };
  };

  const labelPoint = (index) => {
    const angle = -Math.PI / 2 + step * index;
    const r = radius + 26;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
    };
  };

  const polygonPoints = stats
    .map((s, i) => {
      const p = point(s.value, i);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div
      className="page page--type"
      style={{ backgroundImage: `linear-gradient(135deg, ${g1}, ${g2})` }}
    >
      <div className="detail-header">
        <div>
          <h2>Detail Pokemon #{pokemon.id}</h2>
          <p className="detail-name">
            {pokemon.name?.french} / {pokemon.name?.english}
          </p>
          <p className="detail-types">Types: {pokemon.type?.join(", ")}</p>
        </div>
        <Link to={`/pokemon/${pokemon.id}/edit`} className="btn-primary">
          Modifier
        </Link>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <img className="detail-image" src={pokemon.image} alt={pokemon.name?.english} />
          <div className="detail-info">
            <p><strong>ID:</strong> {pokemon.id}</p>
            <p><strong>Nom FR:</strong> {pokemon.name?.french}</p>
            <p><strong>Nom EN:</strong> {pokemon.name?.english}</p>
            <p><strong>Nom JP:</strong> {pokemon.name?.japanese}</p>
            <p><strong>Nom CN:</strong> {pokemon.name?.chinese}</p>
          </div>
        </div>

        <div className="stats">
          <h3>Stats</h3>
          <svg className="radar" viewBox="0 0 400 400">
            <circle className="radar-ring" cx={center.x} cy={center.y} r={radius * 0.33} />
            <circle className="radar-ring" cx={center.x} cy={center.y} r={radius * 0.66} />
            <circle className="radar-ring" cx={center.x} cy={center.y} r={radius} />
            {stats.map((_, i) => {
              const lp = labelPoint(i);
              return (
                <line
                  key={`axis-${i}`}
                  className="radar-axis"
                  x1={center.x}
                  y1={center.y}
                  x2={lp.x}
                  y2={lp.y}
                />
              );
            })}
            <polygon className="radar-shape" points={polygonPoints} />
            {stats.map((s, i) => {
              const p = point(s.value, i);
              return <circle key={`pt-${s.label}`} className="radar-point" cx={p.x} cy={p.y} r="4" />;
            })}
            {stats.map((s, i) => {
              const lp = labelPoint(i);
              return (
                <text
                  key={`label-${s.label}`}
                  className="radar-label"
                  x={lp.x}
                  y={lp.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {s.label} {s.value}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
