
import React, { useState, useEffect } from 'react';

const endpoint = process.env.REACT_APP_API_ENDPOINT;

const ingredientOptions = {
  bread: ['White', 'Wheat', 'Rye', 'Sour dough', 'Honey Wheat'],
  veggies: ['Lettuce', 'Tomato', 'Pickles', 'Olives', 'Banana Peppers', 'Jalapenos', 'Spinach', 'Cucumber', 'Avacado'],
  meat: ['Turkey', 'Ham', 'Roast Beef', 'Chicken', 'Egg', 'Brisket'],
  cheese: ['Swiss', 'Cheddar', 'Pepper Jack', 'American'],
  sauces: ['Mayo', 'Mustard', 'Honey Mustard', 'Chipotle', 'Long Island']
};

function App() {
  const [sandwiches, setSandwiches] = useState([]);
  const [form, setForm] = useState({
    sandwichId: '',
    name: '',
    bread: '',
    veggies: [],
    cheese: [],
    meat: [],
    sauces: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!endpoint) {
      setError('API endpoint is not set.');
      return;
    }

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        setSandwiches(data);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch sandwiches.');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setForm(prev => {
      const current = new Set(prev[category]);
      if (checked) {
        current.add(value);
      } else {
        current.delete(value);
      }
      return { ...prev, [category]: Array.from(current) };
    });
  };

  const handleSubmit = async () => {
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const res = await fetch(endpoint);
      const updated = await res.json();
      setSandwiches(updated);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to save sandwich.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Create Your Sandwich</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input placeholder="Order ID" name="sandwichId" onChange={handleInputChange} /><br /><br />
      <input placeholder="Your Name" name="name" onChange={handleInputChange} /><br /><br />

      <label>Bread:</label><br />
      <select name="bread" onChange={handleInputChange}>
        <option value="">--Select Bread--</option>
        {ingredientOptions.bread.map((b, i) => (
          <option key={i} value={b}>{b}</option>
        ))}
      </select><br /><br />

      {['veggies', 'meat', 'cheese', 'sauces'].map(category => (
        <div key={category}>
          <label>{category.charAt(0).toUpperCase() + category.slice(1)}:</label><br />
          {ingredientOptions[category].map((item, i) => (
            <label key={i}>
              <input
                type="checkbox"
                value={item}
                checked={form[category].includes(item)}
                onChange={(e) => handleCheckboxChange(e, category)}
              /> {item}
            </label>
          ))}
          <br /><br />
        </div>
      ))}

      <button onClick={handleSubmit}>Save Sandwich</button>

      <h3>Saved Sandwiches</h3>
      {Array.isArray(sandwiches) ? (
        <ul>
          {sandwiches.map((s, i) => (
            <li key={i} style={{ marginBottom: '1rem' }}>
              <strong>{s.name}</strong> (ID: {s.sandwichId})<br />
              Bread: {s.bread}<br />
              Veggies: {s.veggies?.join(', ')}<br />
              Cheese: {s.cheese?.join(', ')}<br />
              Meat: {s.meat?.join(', ')}<br />
              Sauces: {s.sauces?.join(', ')}
            </li>
          ))}
        </ul>
      ) : (
        <p>No sandwiches found or API error.</p>
      )}
    </div>
  );
}

export default App;
