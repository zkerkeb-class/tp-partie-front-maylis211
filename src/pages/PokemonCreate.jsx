import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  id: "",
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

const PokemonCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onTypeChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, type: values.join(", ") }));
  };

  const buildPayload = () => ({
    id: Number(form.id),
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("http://localhost:3000/pokemons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!response.ok) throw new Error("Create failed");
      const created = await response.json();
      navigate(`/pokemon/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h2>Ajouter un Pokemon</h2>
      {error && <p>Erreur: {error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>ID</label>
          <input name="id" value={form.id} onChange={onChange} />
        </div>
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
          <button type="submit" disabled={saving}>Creer</button>
        </div>
      </form>
    </div>
  );
};

export default PokemonCreate;
