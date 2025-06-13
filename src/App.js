import React, { useState, useEffect } from 'react';

const endpoint = process.env.REACT_APP_API_ENDPOINT;

function App() {
  const [sandwiches, setSandwiches] = useState([]);
  const [form, setForm] = useState({
    sandwichId: '',
    name: '',
    bread: '',
    veggies: '',
    cheese: '',
    meat: '',
    sauces: ''
  });

  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(setSandwiches)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      veggies: form.veggies.split(',').map(v => v.trim()),
      cheese: form.cheese.split(',').map(c => c.trim()),
      meat: form.meat.split(',').map(m => m.trim()),
      sauces: form.sauces.split(',').map(s => s.trim())
    };

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const res = await fetch(endpoint);
    const updated = await res.json();
    setSandwiches(updated);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Create Your Sandwich</h2>
      <input placeholder="Order ID" name="sandwichId" onChange={handleChange} /><br /><br />
      <input placeholder="Your Name" name="name" onChange={handleChange} /><br /><br />
      <input placeholder="Bread" name="bread" onChange={handleChange} /><br /><br />
      <input placeholder="Veggies (comma-separated)" name="veggies" onChange={handleChange} /><br /><br />
      <input placeholder="Cheese (comma-separated)" name="cheese" onChange={handleChange} /><br /><br />
      <input placeholder="Meat (comma-separated)" name="meat" onChange={handleChange} /><br /><br />
      <input placeholder="Sauces (comma-separated)" name="sauces" onChange={handleChange} /><br /><br />
      <button onClick={handleSubmit}>Save Sandwich</button>

      <h3>Saved Sandwiches</h3>
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
    </div>
  );
}

export default App;
