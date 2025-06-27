import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState('');

  const search = () => {
    onSearch(term);
  };

  return (
    <div className="SearchBar">
      <input 
        placeholder="Enter A Song, Album, or Artist" 
        onChange={(e) => setTerm(e.target.value)} 
      />
      <button onClick={search}>SEARCH</button>
    </div>
  );
}

export default SearchBar;
