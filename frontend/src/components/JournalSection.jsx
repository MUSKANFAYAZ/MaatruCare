import React, { useState } from 'react';

const JournalSection = ({ entries, onAddEntry }) => {
  const [journalText, setJournalText] = useState('');
  const [expanded, setExpanded] = useState({});
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = () => {
    if (journalText.trim()) {
      onAddEntry(journalText);
      setJournalText('');
    }
  };

  return (
    <div className="journal-section">
      <textarea
        className="journal-textarea"
        placeholder="Write your thoughts, feelings, and reflections here..."
        value={journalText}
        onChange={(e) => setJournalText(e.target.value)}
        rows="4"
      />
      <button 
        className="journal-submit-btn"
        onClick={handleSubmit}
        disabled={!journalText.trim()}
      >
        Save Journal Entry
      </button>

      <div className="journal-entries">
        {(showAll ? entries : (entries.length ? [entries[0]] : [])).map((entry) => {
          const isExpanded = !!expanded[entry.id];
          const shouldShowMore = entry.text && entry.text.length > 200;
          return (
            <div key={entry.id} className="journal-entry">
              <p className="entry-date">{entry.date}</p>
              <p className={`entry-text ${isExpanded ? 'expanded' : 'collapsed'}`}>{entry.text}</p>
              {shouldShowMore && (
                <button
                  className="read-more-btn"
                  onClick={() => setExpanded(prev => ({...prev, [entry.id]: !prev[entry.id]}))}
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="no-entries">No journal entries yet. Start writing!</p>
        )}
      </div>
      {entries.length > 1 && (
        <button
          className="show-more-toggle"
          onClick={() => setShowAll(prev => !prev)}
        >
          {showAll ? 'Read less' : `Read more`}
        </button>
      )}
    </div>
  );
};

export default JournalSection;