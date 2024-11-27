import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function ViewEvents() {
  return (
    <div className="container">
      <div>
        <p>This page is for view events!</p>
      </div>
    </div>
  );
}

export default ViewEvents;
