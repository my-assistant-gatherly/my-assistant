import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="abt-pg-my-asst" style={{ padding: '100px', marginLeft: '0', marginRight: 'auto', textAlign: 'left' }}>
        <h2 style={{color: 'purple'}}>About My Assistant</h2>
        <p>My Assistant is a user-friendly event management application designed to 
          simplify the planning, organization, and viewing of events. It fosters a 
          sense of community by helping users connect through events while providing 
          tools to enhance organization and accessibility.
        </p>

        <h2 style={{color: 'purple'}}>Key Features</h2>
          <ul>
            <li>
              <span style={{ fontWeight: 'bold', color: 'purple' }}>Event Scheduling:</span> Any user can create events and decide whether they are 
              public or private.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: 'purple' }}>Effortless Event Viewing:</span> Public events are viewable by all users, while 
              private events are accessible only to invited participants.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: 'purple' }}>Event Notes and Tasks:</span> Add notes and tasks specific to each event, helping 
              users stay organized and track important details.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: 'purple' }}>Search by Events or User Skills:</span> Find events easily or search for users based 
              on their listed skills to connect with the right contributors and participants.
            </li>
            <li>
              <span style={{ fontWeight: 'bold', color: 'purple' }}>Privacy Controls:</span> Ensure that private event details remain secure and visible 
              only to the intended audience.
            </li>
          </ul>

        <h2 style={{color: 'purple'}}>Purpose</h2>
        <p>The app is designed not only to simplify event planning but also to strengthen connections within a community. Whether creating public gatherings or private events, My Assistant helps users share their skills, organize effectively, and engage with others. Its practical features and collaborative design empower users to build meaningful relationships while managing events with ease.
        </p>
    </div>
  );
}

export default AboutPage;
