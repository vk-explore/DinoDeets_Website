import React, { useState, useEffect } from 'react';

export function EditorUI({ engineState, activeScene, activeState, activeResolution, onSceneChange, onStateChange, onResolutionChange, onAddAsset, onRemoveAsset, onAddLight, onRemoveLight, onSelectObject, copyAnimationsToAll }) {
  const [scenes, setScenes] = useState(Object.keys(engineState.scenes || {}));
  const [assets, setAssets] = useState([]);
  const [selectedTheatreKey, setSelectedTheatreKey] = useState(null);

  const handleItemClick = (key) => {
    setSelectedTheatreKey(key);
    if (onSelectObject) onSelectObject(key);
  };
  
  const sceneData = engineState.scenes[activeScene] || { objects: [], lights: [], camera: null };
  const sceneObjects = sceneData.objects || [];
  const sceneLights = sceneData.lights || [];
  const sceneCamera = sceneData.camera;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/DinoDeets_Website/api/images')
      .then(res => res.json())
      .then(data => {
        setAssets(data.images || []);
      });
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  const handleAddScene = () => {
    const name = prompt("Enter new scene name:");
    if (name && !engineState.scenes[name]) {
      engineState.scenes[name] = { objects: [], lights: [], camera: { id: 'cam_main', fov: 50, position: [0, 0, 10], name: 'Main Camera' } };
      setScenes(Object.keys(engineState.scenes));
      onSceneChange(name);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      const res = await fetch('/DinoDeets_Website/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, image: base64 })
      });
      const data = await res.json();
      if (data.success) {
        setAssets(prev => [...prev, data.path]);
        onAddAsset(data.path); // Add to scene immediately
      }
    };
    reader.readAsDataURL(file);
  };

  const SectionHeader = ({ title }) => (
    <div style={{ background: '#222', padding: '6px 10px', fontSize: '11px', textTransform: 'uppercase', color: '#888', fontWeight: 'bold', borderBottom: '1px solid #333', borderTop: '1px solid #333' }}>
      {title}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', top: `${position.y}px`, left: `${position.x}px`, zIndex: 10000,
      background: '#181818', color: '#d0d0d0', borderRadius: '6px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', 
      fontSize: '12px', border: '1px solid #333',
      width: '280px', display: 'flex', flexDirection: 'column',
      maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
    }}>
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ 
          background: '#222', padding: '10px', display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', cursor: isDragging ? 'grabbing' : 'grab', borderBottom: isCollapsed ? 'none' : '1px solid #333' 
        }}
      >
        <div style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, color: '#f59e0b', fontSize: '13px' }}>Maya Outliner</h3>
          <span style={{ fontSize: '10px', color: '#888' }}>{activeScene} | {activeState} | {activeResolution}</span>
        </div>
        <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }}>
          {isCollapsed ? '+' : '-'}
        </button>
      </div>

      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
          
          <SectionHeader title="Scene Controls" />
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <select value={activeScene} onChange={(e) => onSceneChange(e.target.value)} style={{ flex: 1, padding: '4px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '3px' }}>
                {scenes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleAddScene} title="Add New Scene" style={{ background: '#2a2a2a', border: '1px solid #444', color: '#ccc', borderRadius: '3px', cursor: 'pointer', padding: '0 8px' }}>+</button>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <select value={activeState} onChange={(e) => onStateChange(e.target.value)} style={{ flex: 1, padding: '4px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '3px' }}>
                <option value="transition_in">In</option>
                <option value="idle">Idle</option>
                <option value="transition_out">Out</option>
              </select>
              <select value={activeResolution} onChange={(e) => onResolutionChange(e.target.value)} style={{ flex: 1, padding: '4px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '3px' }}>
                <option value="16:9">16:9</option>
                <option value="9:16">9:16</option>
                <option value="1:1">1:1</option>
                <option value="4:3">4:3</option>
                <option value="3:4">3:4</option>
              </select>
            </div>
          </div>

          <SectionHeader title="Hierarchy" />
          <div style={{ padding: '10px 0', flex: 1 }}>
            
            {/* Camera */}
            <div 
              onClick={() => handleItemClick(sceneCamera ? sceneCamera.name : 'Main Camera')}
              style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', color: selectedTheatreKey === (sceneCamera ? sceneCamera.name : 'Main Camera') ? '#f59e0b' : '#aaa', cursor: 'pointer', background: selectedTheatreKey === (sceneCamera ? sceneCamera.name : 'Main Camera') ? '#2a2a2a' : 'transparent' }}
            >
              <span style={{ marginRight: '8px' }}>📽️</span> {sceneCamera ? sceneCamera.name : 'Main Camera'}
            </div>

            {/* Lights */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px', marginTop: '10px' }}>
              <strong style={{ color: '#888' }}>Lights</strong>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => onAddLight('ambient')} title="Add Ambient Light" style={{ background: '#2a2a2a', border: '1px solid #444', color: '#ccc', borderRadius: '3px', cursor: 'pointer' }}>+ A</button>
                <button onClick={() => onAddLight('directional')} title="Add Directional Light" style={{ background: '#2a2a2a', border: '1px solid #444', color: '#ccc', borderRadius: '3px', cursor: 'pointer' }}>+ D</button>
              </div>
            </div>
            {sceneLights.map(light => (
              <div 
                key={light.id} 
                onClick={() => handleItemClick(light.name)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px 4px 25px', cursor: 'pointer', background: selectedTheatreKey === light.name ? '#2a2a2a' : 'transparent', color: selectedTheatreKey === light.name ? '#f59e0b' : '#d0d0d0' }}
              >
                <span>💡 {light.name}</span>
                <button onClick={(e) => { e.stopPropagation(); onRemoveLight(light.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
              </div>
            ))}

            {/* Objects */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px', marginTop: '10px' }}>
              <strong style={{ color: '#888' }}>Objects</strong>
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <select onChange={(e) => { if (e.target.value) onAddAsset(e.target.value); e.target.value = ''; }} style={{ width: '80px', padding: '2px', background: '#2a2a2a', color: '#fff', border: '1px solid #444', borderRadius: '3px' }}>
                  <option value="">+ Add</option>
                  {assets.map(a => <option key={a} value={a}>{a.split('/').pop()}</option>)}
                </select>
                <label style={{ background: '#2a2a2a', border: '1px solid #444', color: '#ccc', borderRadius: '3px', cursor: 'pointer', padding: '2px 5px', fontSize: '10px' }}>
                  Up
                  <input type="file" onChange={handleUpload} accept="image/*" style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            {sceneObjects.map(obj => (
              <div 
                key={obj.id} 
                onClick={() => handleItemClick(obj.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 10px 4px 25px', cursor: 'pointer', background: selectedTheatreKey === obj.id ? '#2a2a2a' : 'transparent', color: selectedTheatreKey === obj.id ? '#f59e0b' : '#d0d0d0' }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🖼️ {obj.name || obj.src.split('/').pop()}</span>
                <button onClick={(e) => { e.stopPropagation(); onRemoveAsset(obj.id); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
              </div>
            ))}
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid #333' }}>
            <button onClick={copyAnimationsToAll} style={{ padding: '8px', background: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>
              Copy Animation to all Res
            </button>
            <button onClick={() => alert("To show Transform Gizmos in 3D View:\\n1. Click the 'Snapshot Camera Icon' inside Theatre.js Studio Outliner.\\n2. Press W/E/R on your keyboard.")} style={{ padding: '8px', background: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer' }}>
              ℹ️ How to open 3D Editor View
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
