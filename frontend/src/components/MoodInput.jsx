import React, { useState } from 'react';

const MoodInput = ({ onMoodSelect, selectedMood }) => {
  const moods = [
    { emoji: '😢', label: 'Very Bad', value: 1, color: '#FF6B6B' },
    { emoji: '😞', label: 'Bad', value: 2, color: '#FFA500' },
    { emoji: '😐', label: 'Okay', value: 3, color: '#FFD93D' },
    { emoji: '🙂', label: 'Good', value: 4, color: '#6BCB77' },
    { emoji: '😄', label: 'Excellent', value: 5, color: '#4D96FF' }
  ];

  const handleSubmit = () => {
    if (selectedMood) {
      const entry = {
        mood: selectedMood,
        timestamp: new Date().toISOString()
      };
      const moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      moodHistory.push(entry);
      localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
      alert('Mood saved! Keep tracking your emotions.');
    }
  };

  return (
    <div className="mood-input-container">
      <div className="mood-emojis">
        {moods.map((mood) => (
          <button
            key={mood.value}
            className={`mood-emoji-btn ${selectedMood === mood.value ? 'selected' : ''}`}
            onClick={() => onMoodSelect(mood.value)}
            style={{
              borderColor: selectedMood === mood.value ? mood.color : '#ddd',
              backgroundColor: selectedMood === mood.value ? mood.color + '20' : 'transparent'
            }}
            title={mood.label}
          >
            <span className="emoji-large">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
      <button 
        className="save-mood-btn"
        onClick={handleSubmit}
        disabled={!selectedMood}
      >
        Save Mood
      </button>
    </div>
  );
};

export default MoodInput;