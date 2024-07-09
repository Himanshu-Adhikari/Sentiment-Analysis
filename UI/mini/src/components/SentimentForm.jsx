import React, { useState } from 'react';
import axios from 'axios';

const SentimentForm = () => {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState('');

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/predict_sentiment', { text });
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error('Error fetching sentiment:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter text for sentiment analysis..."
          value={text}
          onChange={handleTextChange}
          rows={5}
          cols={50}
        />
        <br />
        <button type="submit">Analyze Sentiment</button>
      </form>
      {sentiment && <p>Sentiment: {sentiment}</p>}
    </div>
  );
};

export default SentimentForm;
