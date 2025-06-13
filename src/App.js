import React, { useEffect, useState } from 'react';

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const ingredientsList = {
  bread: ['White', 'Wheat', 'Rye', 'Sour dough', 'Honey Wheat'],
  veggies: ['Lettuce', 'Tomato', 'Pickles', 'Olives', 'Banana Peppers', 'Jalapenos', 'Spinach', 'Cucumber', 'Avacado'],
  meat: ['Turkey', 'Ham', 'Roast Beef', 'Chicken', 'Egg', 'Brisket'],
  cheese: ['Swiss', 'Cheddar', 'Pepper Jack', 'American'],
  sauces: ['Mayo', 'Mustard', 'Honey Mustard', 'Chipotle', 'Long Island']
};

function App() {
  const [form, setForm] = useState({
    sandwichId: '',
    name: '',
    bread: '',
    veggies: [],
    meat: [],
    cheese: [],
    sauces: []
  });
  const [sandwiches, setSandwiches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSandwiches();
  }, []);

  const fetchSandwiches = async () => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      console.log("Fetched sandwiches:", data);
      setSandwiches(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("No sandwiches found or API error");
    }
  };

  const handleChange = (category, value, isMulti = false) => {
    setForm(prev => {
      if (isMulti) {
        const existing = prev[category] || [];
        return {
          ...prev,
          [category]: existing.includes(value)
            ? existing.filter(i => i !== value)
            : [...existing, value]
        };
      } else {
        return { ...prev, [category]: value };
      }
    });
  };

  const handleSubmit = async () => {
    console.log("Submitting sandwich:", form);
    if (!form.sandwichId || !form.name || !form.bread) {
      alert("Please enter Sandwich ID, Name, and Bread");
      return;
    }
    if (!endpoint) {
      console.error("API endpoint not configured.");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      console.log("Save response:", await res.text());
      fetchSandwiches();  // refresh list
    } catch (err) {
      console.error("Error saving sandwich:", err);
      setError("Failed to save sandwich");
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Perfect Sandwich Builder</h1>
      <input
        placeholder="Sandwich ID"
        value={form.sandwichId}
        onChange={e => handleChange('sandwichId', e.target.value)}
      />
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => handleChange('name', e.target.value)}
      />
      <select onChange={e => handleChange('bread', e.target.value)} value={form.bread}>
        <option value="">Select Bread</option>
        {ingredientsList.bread.map(b => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
      {['veggies', 'meat', 'cheese', 'sauces'].map(cat => (
        <div key={cat}>
          <h3>{cat[0].toUpperCase() + cat.slice(1)}</h3>
          {ingredientsList[cat].map(i => (
            <label key={i} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={form[cat].includes(i)}
                onChange={() => handleChange(cat, i, true)}
              />
              {i}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Save Sandwich</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>Saved Sandwiches</h2>
      {sandwiches.length === 0 ? <p>No sandwiches found.</p> : (
        <ul>
          {sandwiches.map((s, i) => (
            <li key={i}>
              <strong>{s.name}</strong> ({s.sandwichId}) - {s.bread}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
