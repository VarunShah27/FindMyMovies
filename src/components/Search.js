// src/components/Search.js

import React from 'react'

function Search({ handleInput, search }) {
  return (
    <section className='search-box-wrap'>
      <input 
        type="text" 
        placeholder='Search for a movie...' 
        className='search-box' 
        onChange={handleInput}
        onKeyDown={search}
      />
    </section>
  )
}

export default Search