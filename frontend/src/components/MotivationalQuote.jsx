import React, { useState, useEffect } from 'react';

const MotivationalQuote = () => {
  const [quote, setQuote] = useState('');

  const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Your mental health is a priority, not a luxury.", author: "Unknown" },
    { text: "You are stronger than you think.", author: "Unknown" },
    { text: "Every day is a fresh start.", author: "Unknown" },
    { text: "Progress, not perfection.", author: "Unknown" },
    { text: "You deserve to be happy.", author: "Unknown" },
    { text: "Small steps lead to big changes.", author: "Unknown" },
    { text: "Be kind to yourself.", author: "Unknown" },
    { text: "This too shall pass.", author: "Unknown" },
    { text: "You've got this!", author: "Unknown" }
  ];

  useEffect(() => {
    const dailyQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(dailyQuote);
  }, []);

  return (
    <div className="motivational-quote">
      <div className="quote-content">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>
    </div>
  );
};

export default MotivationalQuote;