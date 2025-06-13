import React, { useState } from 'react';
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const ingredientsList = {
  bread: ['White', 'Wheat', 'Multigrain', 'Rye', 'Sourdough'],
  meat: ['Turkey', 'Ham', 'Chicken', 'Roast Beef', 'Egg'],
  cheese: ['Cheddar', 'Swiss', 'American', 'Pepper Jack'],
  veggies: ['Lettuce', 'Tomato', 'Onions', 'Pickles', 'Spinach', 'Olives'],
  sauces: ['Mayo', 'Mustard', 'Chipotle', 'Honey Mustard', 'Sriracha']
};

function App() {
  const [ingredients, setIngredients] = useState({});
  const [status, setStatus] = useState('');

  const toggleIngredient = (category, item) => {
    setIngredients(prev => {
      const items = prev[category] || [];
      const updated = items.includes(item)
        ? items.filter(i => i !== item)
        : [...items, item];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async () => {
    const sandwich = {
      sandwichId: new Date().toISOString(),
      ...ingredients
    };
    try {
      await axios.post(API_ENDPOINT, sandwich);
      setStatus('✅ Sandwich saved!');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to save sandwich.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Build Your Sandwich</h1>
      {Object.entries(ingredientsList).map(([category, items]) => (
        <div key={category}>
          <h3>{category}</h3>
          {items.map(item => (
            <label key={item} style={{ marginRight: 10 }}>
              <input
                type="checkbox"
                onChange={() => toggleIngredient(category, item)}
                checked={ingredients[category]?.includes(item) || false}
              /> {item}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} style={{ marginTop: 20 }}>Save Sandwich</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
