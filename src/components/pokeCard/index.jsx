import { useEffect, useRef } from "react";
import "./PokeCard.css";

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#6b9e51",
  electric: "#F8D030",
  psychic: "#F85888",
  rock: "#B8A038",
  bug: "#A8B820",
  normal: "#a0a09a",
  dark: "#6e6674",
  psy: "#f95587",
  poison: "#745393",
  ground: "#e0c068",
  steel: "#b8b8d0",
  ghost: "#705898",
  ice: "#98d8d8",
  dragon: "#7038f8",
  fairy: "#ee90e6",
  fighting: "#725325",
  flying: "#90a5f0",
};

const typeIcons = {
  fire: "/typeSigns/fire.png",
  water: "/typeSigns/water.png",
  grass: "/typeSigns/grass.jpg",
  electric: "/typeSigns/electric.png",
  psychic: "/typeSigns/psychic.png",
  rock: "/typeSigns/rock.png",
  bug: "/typeSigns/bug.png",
  normal: "/typeSigns/normal.png",
  dark: "/typeSigns/dark.png",
  poison: "/typeSigns/poison.png",
  ground: "/typeSigns/ground.png",
  steel: "/typeSigns/steel.png",
  ghost: "/typeSigns/ghost.png",
  ice: "/typeSigns/ice.png",
  dragon: "/typeSigns/dragon.png",
  fairy: "/typeSigns/fairy.png",
  fighting: "/typeSigns/fighting.png",
  flying: "/typeSigns/flying.png",
};

const typeBackgrounds = {
  fire: "/backgrounds/fire.png",
  water: "/backgrounds/water.jpg",
  grass: "/backgrounds/grass.png",
  electric: "/backgrounds/electrik.png",
  psychic: "/backgrounds/psy.jpg",
  bug: "/backgrounds/bug.png",
  normal: "/backgrounds/normal.png",
  dark: "/backgrounds/dark.jpg",
  fairy: "/backgrounds/fairy.jpg",
  dragon: "/backgrounds/dragon.png",
  ice: "/backgrounds/ice.png",
  fighting: "/backgrounds/fight.jpg",
  flying: "/backgrounds/fly.png",
  rock: "/backgrounds/rock.png",
  ground: "/backgrounds/ground.png",
  poison: "/backgrounds/poison.jpg",
  steel: "/backgrounds/steel.png",
  ghost: "/backgrounds/ghost.jpg",
};

const PokeCard = ({ pokemon }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const mx = (x / rect.width) * 100;
      const my = (y / rect.height) * 100;

      const rx = ((my - 50) / 10) * -1;
      const ry = (mx - 50) / 10;

      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);
      card.style.setProperty("--rx", `${rx}deg`);
      card.style.setProperty("--ry", `${ry}deg`);
    };

    const reset = () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", reset);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", reset);
    };
  }, []);

  if (!pokemon) return null;

  const mainType = pokemon.type?.[0]?.toLowerCase() || "normal";
  const bgImage = typeBackgrounds[mainType];
  const mainColor = typeColors[mainType] || "#ccc";
  const hp = pokemon.base?.HP ?? "?";
  const name = pokemon.name?.french || pokemon.name?.english || "Pokemon";

  return (
    <div
      ref={cardRef}
      className="pokemon-card"
    >
      <div className="pokemon-card__inner">
        <div className="pokemon-card__holo" />
        <div className="pokemon-card__paillettes" />
        <div className="pokemon-card__bruit" />

        <div
          className="tcg-inner"
          style={{ background: `linear-gradient(${mainColor}, ${mainColor}80)` }}
        >
          <div className="tcg-header">
            <span className="stage">Basic</span>
            <span className="name">{name}</span>
            <div className="hp-wrapper">
              <span className="hp">{hp} HP</span>
              {typeIcons[mainType] && (
                <img className="type-icon" src={typeIcons[mainType]} alt={mainType} />
              )}
            </div>
          </div>

          <div
            className="tcg-image"
            style={{
              backgroundImage: bgImage ? `url(${bgImage})` : "none",
              "--type-gif": `url(/gif/${mainType}.gif)`,
            }}
          >
            <img
              src={pokemon.image}
              alt={name}
              className="pokemon-art"
            />
          </div>

          <div className="tcg-info">
            <span>N°{pokemon.id}</span>
            <span>Type: {pokemon.type?.join(", ")}</span>
            <span>Attack: {pokemon.base?.Attack ?? "?"}</span>
          </div>

          <div className="tcg-attacks">
            <div className="attack" style={{ "--attack-color": mainColor }}>
              <div className="attack-left">
                {typeIcons[mainType] && (
                  <img
                    src={typeIcons[mainType]}
                    alt={mainType}
                    className="attack-type-icon"
                  />
                )}
                <span className="attack-name">Charge</span>
              </div>
              <span className="attack-dmg">{pokemon.base?.Attack ?? 20}</span>
            </div>
            <div className="attack" style={{ "--attack-color": mainColor }}>
              <div className="attack-left">
                {typeIcons[mainType] && (
                  <img
                    src={typeIcons[mainType]}
                    alt={mainType}
                    className="attack-type-icon"
                  />
                )}
                <span className="attack-name">Special</span>
              </div>
              <span className="attack-dmg">{pokemon.base?.SpecialAttack ?? 30}</span>
            </div>
          </div>
        </div>

        <div className="tcg-footer">
          <span designer="designer">2026 Illus. Maylis </span>
        </div>
      </div>
    </div>
  );
};

export default PokeCard;
