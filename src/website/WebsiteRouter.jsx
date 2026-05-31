import React from 'react';

export default function WebsiteRouter({ activeRoute }) {
  // Map standard routes to their respective HTML components
  switch (activeRoute) {
    case '/':
      return (
        <div style={{ padding: '100px', color: 'white', textAlign: 'center', pointerEvents: 'auto' }}>
          <h1 style={{ fontSize: '4rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>Welcome to Dino Deets</h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '600px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            Explore the prehistoric world. Click on the signpost to open the Encyclopedia, or the dig site to hunt for fossils.
          </p>
          <button 
            onClick={() => window.location.hash = '#/encyclopedia'}
            style={{ 
              marginTop: '40px', padding: '12px 24px', fontSize: '1.2rem', 
              background: 'var(--color-amber)', color: 'black', border: 'none', 
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            Open Encyclopedia (HTML Button Test)
          </button>
        </div>
      );
      
    case '/encyclopedia':
      return (
        <div style={{ padding: '100px', color: 'white', pointerEvents: 'auto' }}>
          <h1 style={{ fontSize: '3rem', borderBottom: '2px solid var(--color-amber)', display: 'inline-block', paddingBottom: '10px' }}>Encyclopedia</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2>Tyrannosaurus Rex</h2>
              <p>The tyrant lizard king.</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2>Triceratops</h2>
              <p>The three-horned face.</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.hash = '#/'}
            style={{ 
              marginTop: '40px', padding: '10px 20px', 
              background: 'transparent', color: 'white', border: '2px solid white', 
              borderRadius: '8px', cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>
      );
      
    case '/fossil-dig':
      return (
        <div style={{ padding: '100px', color: 'white', textAlign: 'center', pointerEvents: 'auto' }}>
          <h1>Fossil Dig Mini-Game</h1>
          <p>Grab your brush and excavate some bones!</p>
        </div>
      );
      
    default:
      return (
        <div style={{ padding: '100px', color: 'white', textAlign: 'center', pointerEvents: 'auto' }}>
          <h1>404 - Page Not Found</h1>
          <button onClick={() => window.location.hash = '#/'} style={{ marginTop: '20px', padding: '10px 20px' }}>Go Home</button>
        </div>
      );
  }
}
