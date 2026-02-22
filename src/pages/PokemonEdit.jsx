import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const emptyForm = {
  nameEnglish: "",
  nameFrench: "",
  nameJapanese: "",
  nameChinese: "",
  type: "",
  image: "",
  hp: "",
  attack: "",
  defense: "",
  spAttack: "",
  spDefense: "",
  speed: "",
};

const PokemonEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/pokemons/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Pokemon not found");
        return res.json();
      })
      .then((data) => {
        setPokemon(data);
        setForm({
          nameEnglish: data.name?.english || "",
          nameFrench: data.name?.french || "",
          nameJapanese: data.name?.japanese || "",
          nameChinese: data.name?.chinese || "",
          type: (data.type || []).join(", "),
          image: data.image || "",
          hp: data.base?.HP ?? "",
          attack: data.base?.Attack ?? "",
          defense: data.base?.Defense ?? "",
          spAttack: data.base?.SpecialAttack ?? "",
          spDefense: data.base?.SpecialDefense ?? "",
          speed: data.base?.Speed ?? "",
        });
        setError("");
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onTypeChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, type: values.join(", ") }));
  };

  const buildPayload = () => ({
    id: Number(id),
    name: {
      english: form.nameEnglish,
      french: form.nameFrench,
      japanese: form.nameJapanese,
      chinese: form.nameChinese,
    },
    type: form.type.split(",").map((t) => t.trim()).filter(Boolean),
    image: form.image,
    base: {
      HP: Number(form.hp),
      Attack: Number(form.attack),
      Defense: Number(form.defense),
      SpecialAttack: Number(form.spAttack),
      SpecialDefense: Number(form.spDefense),
      Speed: Number(form.speed),
    },
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3000/pokemons/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildPayload()),
        }
      );
      if (!response.ok) throw new Error("Update failed");
      const updated = await response.json();
      setPokemon(updated);
      navigate(`/pokemon/${updated.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/pokemons/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Delete failed");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!pokemon) return <p>Pokemon introuvable.</p>;

  return (
    <div className="page">
      <div className="detail-header">
        <h2>Modifier Pokemon #{pokemon.id}</h2>
      </div>

      <form className="form" onSubmit={handleSave}>
        <div className="form-row">
          <label>Nom (FR)</label>
          <input name="nameFrench" value={form.nameFrench} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Nom (EN)</label>
          <input name="nameEnglish" value={form.nameEnglish} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Nom (JP)</label>
          <input name="nameJapanese" value={form.nameJapanese} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Nom (CN)</label>
          <input name="nameChinese" value={form.nameChinese} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Types (Ctrl pour multi-selection)</label>
          <select
            name="type"
            multiple
            size="6"
            value={form.type.split(",").map((t) => t.trim()).filter(Boolean)}
            onChange={onTypeChange}
          >
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
        </div>
        <div className="form-row">
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={onChange} />
        </div>

        <div className="form-row">
          <label>HP: {form.hp || 0}</label>
          <input type="range" min="1" max="255" name="hp" value={form.hp} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Attack: {form.attack || 0}</label>
          <input type="range" min="1" max="255" name="attack" value={form.attack} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Defense: {form.defense || 0}</label>
          <input type="range" min="1" max="255" name="defense" value={form.defense} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Special Attack: {form.spAttack || 0}</label>
          <input type="range" min="1" max="255" name="spAttack" value={form.spAttack} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Special Defense: {form.spDefense || 0}</label>
          <input type="range" min="1" max="255" name="spDefense" value={form.spDefense} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Speed: {form.speed || 0}</label>
          <input type="range" min="1" max="255" name="speed" value={form.speed} onChange={onChange} />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>Enregistrer</button>
          <button type="button" className="danger" onClick={() => setShowConfirm(true)}>
            Supprimer
          </button>
        </div>
      </form>

      {showConfirm && (
        <div className="modal">
          <div className="modal-content">
            <p>Tu veux vraiment supprimer ce Pokemon ?</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowConfirm(false)}>Annuler</button>
              <button type="button" className="danger" onClick={handleDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonEdit;
