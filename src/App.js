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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const data = {
      ...form,
      veggies: form.veggies.split(',').map(v => v.trim()).filter(Boolean),
      cheese: form.cheese.split(',').map(c => c.trim()).filter(Boolean),
      meat: form.meat.split(',').map(m => m.trim()).filter(Boolean),
      sauces: form.sauces.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
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

      <input placeholder="Order ID" name="sandwichId" onChange={handleChange} /><br /><br />
      <input placeholder="Your Name" name="name" onChange={handleChange} /><br /><br />
      <input placeholder="Bread" name="bread" onChange={handleChange} /><br /><br />
      <input placeholder="Veggies (comma-separated)" name="veggies" onChange={handleChange} /><br /><br />
      <input placeholder="Cheese (comma-separated)" name="cheese" onChange={handleChange} /><br /><br />
      <input placeholder="Meat (comma-separated)" name="meat" onChange={handleChange} /><br /><br />
      <input placeholder="Sauces (comma-separated)" name="sauces" onChange={handleChange} /><br /><br />
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
