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
          <label>Types (ex: Water)</label>
          <input name="type" value={form.type} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={onChange} />
        </div>

        <div className="form-row">
          <label>HP</label>
          <input name="hp" value={form.hp} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Attack</label>
          <input name="attack" value={form.attack} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Defense</label>
          <input name="defense" value={form.defense} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Special Attack</label>
          <input name="spAttack" value={form.spAttack} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Special Defense</label>
          <input name="spDefense" value={form.spDefense} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Speed</label>
          <input name="speed" value={form.speed} onChange={onChange} />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>Creer</button>
        </div>
      </form>
    </div>
  );
};

export default PokemonCreate;
