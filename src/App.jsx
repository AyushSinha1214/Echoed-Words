import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState('');

  // Fetch quotes
  useEffect(() => {
    fetch('http://localhost:5000/api/quotes')
      .then((res) => res.json())
      .then((data) => setQuotes(data))
      .catch((err) => console.error(err));
  }, []);

  // Add new quote
  const addQuote = () => {
    if (!newQuote.trim()) return;

    fetch('http://localhost:5000/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newQuote }),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuotes([data, ...quotes]);
        setNewQuote('');
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <h1>Echoed Words</h1>
      <div>
        <input
          type="text"
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          placeholder="Enter your quote..."
        />
        <button onClick={addQuote}>Add Quote</button>
      </div>
      <div className="quote-list">
        {quotes.map((quote) => (
          <div key={quote._id} className="quote">
            <p>{quote.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
