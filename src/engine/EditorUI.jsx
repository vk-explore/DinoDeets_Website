import React, { useState, useEffect } from 'react';

export function EditorUI({ 
  engineState, 
  activeScene, 
  activeState, 
  activeResolution, 
  onSwitchContext, 
  onAddScene, 
  onDeleteScene, 
  onRenameScene, 
  onAddAsset, 
  onRemoveAsset, 
  onAddLight, 
  onRemoveLight, 
  onSelectObject, 
  onUpdateObject,
  masterTheatreState, 
  onCopyAnimations,
  sidebarWidth,
  setSidebarWidth 
}) {
  const scenes = Object.keys(engineState.scenes || {});
  const [assets, setAssets] = useState([]);
  const [selectedTheatreKey, setSelectedTheatreKey] = useState(null);

  // Copy Tool States
  const [copySource, setCopySource] = useState(`${activeScene}_${activeState}_${activeResolution}`);
  const [copyTargets, setCopyTargets] = useState({}); // { [sheetName]: boolean }
  const [activeTab, setActiveTab] = useState('hierarchy'); // 'hierarchy' | 'matrix' | 'copy'

  const sceneData = engineState.scenes[activeScene] || { objects: [], lights: [], camera: null };
  const sceneObjects = sceneData.objects || [];
  const sceneLights = sceneData.lights || [];
  const sceneCamera = sceneData.camera;

  const [isResizing, setIsResizing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastWidth, setLastWidth] = useState(330);
  const [isFullyHidden, setIsFullyHidden] = useState(false);
  
  // Render diagnostics log
  console.warn("🎨 [EditorUI] Rendering component status:", { isCollapsed, isFullyHidden, sidebarWidth });

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const states = ['transition_in', 'idle', 'transition_out'];
  const resolutions = ['16:9', '9:16', '1:1', '4:3', '3:4'];

  const stateLabels = {
    transition_in: '🎬 Intro',
    idle: '🦕 Idle',
    transition_out: '💥 Outro'
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle visibility on Alt/Option + \
      if (e.altKey && (e.key === '\\' || e.code === 'Backslash')) {
        setIsFullyHidden(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDragMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = Math.max(260, Math.min(600, e.clientX));
      setSidebarWidth(newWidth);
      setLastWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  const handleCollapse = () => {
    setIsCollapsed(true);
    setSidebarWidth(0);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
    setSidebarWidth(lastWidth);
  };

  // Fetch local assets
  const refreshAssets = () => {
    fetch('/DinoDeets_Website/api/images')
      .then(res => res.json())
      .then(data => {
        setAssets(data.images || []);
      })
      .catch(err => console.error("Error fetching images list:", err));
  };

  useEffect(() => {
    refreshAssets();
  }, []);

  useEffect(() => {
    // Keep source sync'd with active sheet
    setCopySource(`${activeScene}_${activeState}_${activeResolution}`);
  }, [activeScene, activeState, activeResolution]);

  if (isFullyHidden) return null;

  const handlePointerDown = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
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

  const handleAddSceneClick = () => {
    const name = prompt("Enter new scene name:");
    if (name) onAddScene(name.trim());
  };

  const handleItemClick = (key) => {
    setSelectedTheatreKey(key);
    if (onSelectObject) onSelectObject(key);
  };

  // Check if a sheet is configured in masterTheatreState
  const isSheetConfigured = (sheetName) => {
    const sheets = masterTheatreState?.sheetsById || {};
    const sheetData = sheets[sheetName];
    if (!sheetData) return false;
    
    // Check if it has animated tracks
    const trackCount = Object.keys(sheetData.sequence?.tracksByObject || {}).length;
    // Check if it has static overrides
    const overrideCount = Object.keys(sheetData.staticOverrides?.byObject || {}).length;
    
    return trackCount > 0 || overrideCount > 0;
  };

  // Upload handler with base64 key fix
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      const res = await fetch('/DinoDeets_Website/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, base64: base64 }) // Send as base64!
      });
      const data = await res.json();
      if (data.success) {
        const addedPath = data.path || data.url;
        setAssets(prev => [...prev, addedPath]);
        onAddAsset(addedPath); // Add to scene immediately
        alert("Asset uploaded and added to active scene!");
      } else {
        alert("Upload failed: " + (data.error || "unknown error"));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCellClick = (state, res) => {
    if (onSwitchContext) onSwitchContext(activeScene, state, res);
  };

  const handleSelectAllTargets = () => {
    const nextTargets = {};
    states.forEach(s => {
      resolutions.forEach(r => {
        const key = `${activeScene}_${s}_${r}`;
        if (key !== copySource) {
          nextTargets[key] = true;
        }
      });
    });
    setCopyTargets(nextTargets);
  };

  const handleSelectResolutionTargets = () => {
    const nextTargets = {};
    resolutions.forEach(r => {
      const key = `${activeScene}_${activeState}_${r}`;
      if (key !== copySource) {
        nextTargets[key] = true;
      }
    });
    setCopyTargets(nextTargets);
  };

  const handleSelectStateTargets = () => {
    const nextTargets = {};
    states.forEach(s => {
      const key = `${activeScene}_${s}_${activeResolution}`;
      if (key !== copySource) {
        nextTargets[key] = true;
      }
    });
    setCopyTargets(nextTargets);
  };

  const handleClearTargets = () => {
    setCopyTargets({});
  };

  const executeCopy = () => {
    const targets = Object.keys(copyTargets).filter(k => copyTargets[k]);
    if (targets.length === 0) {
      alert("Please select at least one target sheet to copy the animation to!");
      return;
    }
    if (confirm(`Copy animations from "${copySource.split('_').slice(1).join(' ')}" to ${targets.length} other sheet(s)?`)) {
      onCopyAnimations(copySource, targets);
    }
  };

  const toggleTarget = (targetName) => {
    setCopyTargets(prev => ({
      ...prev,
      [targetName]: !prev[targetName]
    }));
  };

  if (isCollapsed) {
    return (
      <button 
        onClick={handleExpand}
        style={{
          position: 'fixed', top: '20px', left: '20px', zIndex: 10000,
          background: 'rgba(14, 26, 22, 0.9)', color: 'var(--color-amber)', 
          borderRadius: '50%', width: '48px', height: '48px',
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          cursor: 'pointer',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)', border: '1px solid rgba(212, 168, 67, 0.4)', 
          fontSize: '22px', userSelect: 'none', transition: 'transform 0.2s',
          outline: 'none'
        }}
        title="Open Project Panel"
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
        🎬
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10000,
      background: 'rgba(14, 26, 22, 0.85)', backdropFilter: 'blur(12px) saturate(180%)',
      color: 'var(--color-text-primary)', borderRight: '1px solid rgba(212, 168, 67, 0.2)',
      width: `${sidebarWidth}px`, display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', boxShadow: '4px 0 32px 0 rgba(0, 0, 0, 0.5)'
    }}>
      {/* Resizable Drag Handle on Right Edge */}
      <div 
        onMouseDown={handleDragMouseDown}
        style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '6px',
          cursor: 'col-resize', background: isResizing ? 'var(--color-amber)' : 'transparent',
          zIndex: 100000, transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(212, 168, 67, 0.4)'}
        onMouseLeave={(e) => {
          if (!isResizing) e.target.style.background = 'transparent';
        }}
      />

      {/* HEADER */}
      <div 
        style={{ 
          background: 'rgba(26, 60, 52, 0.4)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', borderBottom: '1px solid rgba(212, 168, 67, 0.15)', userSelect: 'none' 
        }}
      >
        <div style={{ pointerEvents: 'none', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, color: 'var(--color-amber)', fontFamily: 'var(--font-display)', letterSpacing: '0.5px', fontSize: '13px' }}>DINO BUILDER</h3>
          <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-volcanic)', boxShadow: '0 0 8px var(--color-volcanic)' }}></span>
            {activeScene} | {activeState} | {activeResolution}
          </span>
        </div>
        <button 
          onClick={handleCollapse} 
          style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '16px', padding: '4px', outline: 'none' }}
        >
          —
        </button>
      </div>

      {/* QUICK SWITCH DROPDOWNS */}
      <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(212, 168, 67, 0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select 
            value={activeScene} 
            onChange={(e) => onSwitchContext && onSwitchContext(e.target.value, activeState, activeResolution)} 
            style={{ flex: 1, padding: '6px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid rgba(212, 168, 67, 0.25)', borderRadius: '6px', outline: 'none', cursor: 'pointer' }}
          >
            {scenes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          
          <button onClick={handleAddSceneClick} title="Create Scene" style={{ background: 'var(--color-bg-tertiary)', border: '1px solid rgba(212, 168, 67, 0.2)', color: 'var(--color-amber)', borderRadius: '6px', cursor: 'pointer', padding: '0 10px', fontWeight: 'bold' }}>+</button>
          
          <button 
            onClick={() => {
              const newName = window.prompt("Rename scene to:", activeScene);
              if (newName) onRenameScene(activeScene, newName.trim());
            }} 
            title="Rename Scene" 
            style={{ background: 'var(--color-bg-tertiary)', border: '1px solid rgba(212, 168, 67, 0.2)', color: 'var(--color-text-primary)', borderRadius: '6px', cursor: 'pointer', padding: '0 8px' }}
          >
            ✏️
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm(`Delete the scene "${activeScene}"? This action reloads the page.`)) {
                onDeleteScene(activeScene);
              }
            }} 
            title="Delete Scene" 
            style={{ background: 'rgba(232, 101, 45, 0.1)', border: '1px solid var(--color-volcanic)', color: 'var(--color-volcanic)', borderRadius: '6px', cursor: 'pointer', padding: '0 8px' }}
          >
            🗑️
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <select 
            value={activeState} 
            onChange={(e) => onSwitchContext && onSwitchContext(activeScene, e.target.value, activeResolution)} 
            style={{ flex: 1, padding: '5px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid rgba(212, 168, 67, 0.1)', borderRadius: '6px', outline: 'none' }}
          >
            <option value="transition_in">🎬 Intro Sequence</option>
            <option value="idle">🦕 Idle Sequence</option>
            <option value="transition_out">💥 Outro Sequence</option>
          </select>
          
          <select 
            value={activeResolution} 
            onChange={(e) => onSwitchContext && onSwitchContext(activeScene, activeState, e.target.value)} 
            style={{ flex: 1, padding: '5px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid rgba(212, 168, 67, 0.1)', borderRadius: '6px', outline: 'none' }}
          >
            <option value="16:9">📐 Aspect 16:9</option>
            <option value="9:16">📐 Aspect 9:16</option>
            <option value="1:1">📐 Aspect 1:1</option>
            <option value="4:3">📐 Aspect 4:3</option>
            <option value="3:4">📐 Aspect 3:4</option>
          </select>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(212, 168, 67, 0.1)' }}>
        <button 
          onClick={() => setActiveTab('hierarchy')}
          style={{ 
            flex: 1, padding: '8px 0', border: 'none', background: activeTab === 'hierarchy' ? 'rgba(212, 168, 67, 0.1)' : 'transparent',
            color: activeTab === 'hierarchy' ? 'var(--color-amber)' : 'var(--color-text-muted)', borderBottom: activeTab === 'hierarchy' ? '2px solid var(--color-amber)' : 'none',
            cursor: 'pointer', fontWeight: 'bold', outline: 'none'
          }}
        >
          🌳 Hierarchy
        </button>
        <button 
          onClick={() => setActiveTab('matrix')}
          style={{ 
            flex: 1, padding: '8px 0', border: 'none', background: activeTab === 'matrix' ? 'rgba(212, 168, 67, 0.1)' : 'transparent',
            color: activeTab === 'matrix' ? 'var(--color-amber)' : 'var(--color-text-muted)', borderBottom: activeTab === 'matrix' ? '2px solid var(--color-amber)' : 'none',
            cursor: 'pointer', fontWeight: 'bold', outline: 'none'
          }}
        >
          📊 15-Sheet Grid
        </button>
        <button 
          onClick={() => setActiveTab('copy')}
          style={{ 
            flex: 1, padding: '8px 0', border: 'none', background: activeTab === 'copy' ? 'rgba(212, 168, 67, 0.1)' : 'transparent',
            color: activeTab === 'copy' ? 'var(--color-amber)' : 'var(--color-text-muted)', borderBottom: activeTab === 'copy' ? '2px solid var(--color-amber)' : 'none',
            cursor: 'pointer', fontWeight: 'bold', outline: 'none'
          }}
        >
          🚀 Copy Tool
        </button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* TAB 1: HIERARCHY */}
        {activeTab === 'hierarchy' && (
          <div style={{ padding: '12px' }}>
            {/* Camera */}
            <div 
              onClick={() => handleItemClick(sceneCamera ? sceneCamera.name : 'Main Camera')}
              style={{ 
                display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: '6px',
                color: selectedTheatreKey === (sceneCamera ? sceneCamera.name : 'Main Camera') ? 'var(--color-amber)' : 'var(--color-text-primary)', 
                cursor: 'pointer', background: selectedTheatreKey === (sceneCamera ? sceneCamera.name : 'Main Camera') ? 'var(--color-surface)' : 'transparent',
                border: selectedTheatreKey === (sceneCamera ? sceneCamera.name : 'Main Camera') ? '1px solid rgba(212, 168, 67, 0.3)' : '1px solid transparent',
                transition: 'background 0.2s'
              }}
            >
              <span style={{ marginRight: '8px' }}>📽️</span> {sceneCamera ? sceneCamera.name : 'Main Camera'}
            </div>

            {/* Lights */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 4px 6px 4px' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Lights</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => onAddLight('ambient')} title="Add Ambient Light" style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(212, 168, 67, 0.1)', color: 'var(--color-text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', padding: '2px 6px' }}>+ Amb</button>
                <button onClick={() => onAddLight('directional')} title="Add Directional Light" style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(212, 168, 67, 0.1)', color: 'var(--color-text-primary)', borderRadius: '4px', cursor: 'pointer', fontSize: '9px', padding: '2px 6px' }}>+ Dir</button>
              </div>
            </div>
            {sceneLights.length === 0 ? (
              <div style={{ padding: '6px 10px', color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '11px' }}>No light components.</div>
            ) : sceneLights.map(light => (
              <div 
                key={light.id} 
                onClick={() => handleItemClick(light.name)}
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px 6px 16px', borderRadius: '6px', margin: '2px 0',
                  cursor: 'pointer', background: selectedTheatreKey === light.name ? 'var(--color-surface)' : 'transparent', 
                  color: selectedTheatreKey === light.name ? 'var(--color-amber)' : 'var(--color-text-primary)',
                  border: selectedTheatreKey === light.name ? '1px solid rgba(212, 168, 67, 0.3)' : '1px solid transparent'
                }}
              >
                <span>💡 {light.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveLight(light.id); }} 
                  style={{ background: 'none', border: 'none', color: 'var(--color-volcanic)', cursor: 'pointer', padding: '0 4px', fontSize: '14px', outline: 'none' }}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Objects */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 4px 6px 4px' }}>
              <span style={{ color: 'var(--color-text-muted)', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.5px' }}>Objects</span>
              <label style={{ background: 'var(--color-volcanic)', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '9px', fontWeight: 'bold', border: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                📤 Upload
                <input type="file" onChange={handleUpload} accept="image/*" style={{ display: 'none' }} />
              </label>
            </div>
            
            {sceneObjects.length === 0 ? (
              <div style={{ padding: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', background: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                Scene is empty. Drag in an asset or select from the Library below!
              </div>
            ) : sceneObjects.map(obj => (
              <div key={obj.id} style={{ display: 'flex', flexDirection: 'column', margin: '2px 0' }}>
                <div 
                  onClick={() => handleItemClick(obj.id)}
                  style={{ 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px 6px 16px', borderRadius: '6px',
                    cursor: 'pointer', background: selectedTheatreKey === obj.id ? 'var(--color-surface)' : 'transparent', 
                    color: selectedTheatreKey === obj.id ? 'var(--color-amber)' : 'var(--color-text-primary)',
                    border: selectedTheatreKey === obj.id ? '1px solid rgba(212, 168, 67, 0.3)' : '1px solid transparent'
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>🖼️ {obj.name || obj.src.split('/').pop()}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveAsset(obj.id); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--color-volcanic)', cursor: 'pointer', padding: '0 4px', fontSize: '14px', outline: 'none' }}
                  >
                    ✕
                  </button>
                </div>
                
                {selectedTheatreKey === obj.id && (
                  <div style={{ padding: '8px 10px 8px 16px', background: 'rgba(0,0,0,0.2)', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', marginTop: '-4px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>🔗 Link to Route (e.g. /encyclopedia)</label>
                    <input 
                      type="text" 
                      value={obj.linkToRoute || ''}
                      onChange={(e) => onUpdateObject(obj.id, { linkToRoute: e.target.value })}
                      placeholder="Leave empty for no link"
                      style={{ 
                        width: '100%', background: 'var(--color-bg-primary)', border: '1px solid rgba(212, 168, 67, 0.2)', 
                        color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', outline: 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* ASSETS LIBRARY DRAWER */}
            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(212, 168, 67, 0.1)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--color-amber)', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🎒 Available Assets</span>
                <button onClick={refreshAssets} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '10px' }}>🔄 Refresh</button>
              </div>
              <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', maxHeight: '160px', overflowY: 'auto',
                padding: '4px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'
              }}>
                {assets.length === 0 ? (
                  <div style={{ gridColumn: 'span 3', padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    No uploads yet. Click 'Upload' above to add images!
                  </div>
                ) : assets.map(asset => {
                  const baseName = asset.split('/').pop();
                  return (
                    <div 
                      key={asset}
                      onClick={() => onAddAsset(asset)}
                      title={`Click to add ${baseName} to scene`}
                      style={{ 
                        background: 'var(--color-bg-secondary)', border: '1px solid rgba(255,255,255,0.05)', 
                        borderRadius: '6px', padding: '4px', cursor: 'pointer', textAlign: 'center',
                        transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--color-amber)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ width: '100%', height: '36px', overflow: 'hidden', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={'/DinoDeets_Website' + asset} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ fontSize: '8px', color: 'var(--color-text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '100%', marginTop: '3px' }}>
                        {baseName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANIMATION MATRIX GRID */}
        {activeTab === 'matrix' && (
          <div style={{ padding: '12px' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '10px', marginBottom: '10px', textAlign: 'center' }}>
              Select a cell in the 3x5 matrix grid to immediately switch context. Sheets with 🎬 have keyframe data.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Row header labels */}
              <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(5, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 'bold', fontSize: '9px', color: 'var(--color-text-muted)' }}>
                <div>State</div>
                <div>16:9</div>
                <div>9:16</div>
                <div>1:1</div>
                <div>4:3</div>
                <div>3:4</div>
              </div>

              {states.map(s => (
                <div key={s} style={{ display: 'grid', gridTemplateColumns: '70px repeat(5, 1fr)', gap: '4px', alignItems: 'center' }}>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
                    {s === 'transition_in' ? 'Intro' : s === 'idle' ? 'Idle' : 'Outro'}
                  </div>
                  {resolutions.map(r => {
                    const sheetName = `${activeScene}_${s}_${r}`;
                    const active = activeState === s && activeResolution === r;
                    const configured = isSheetConfigured(sheetName);
                    
                    return (
                      <button
                        key={r}
                        onClick={() => handleCellClick(s, r)}
                        style={{
                          aspectRatio: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                          borderRadius: '6px', border: active ? '2px solid var(--color-amber)' : '1px solid rgba(212, 168, 67, 0.1)',
                          background: active ? 'rgba(212, 168, 67, 0.15)' : configured ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0,0,0,0.25)',
                          cursor: 'pointer', outline: 'none', position: 'relative'
                        }}
                        title={`${stateLabels[s]} | ${r} ${configured ? '(Configured)' : '(Empty)'}`}
                      >
                        <span style={{ fontSize: '14px' }}>
                          {configured ? '🎬' : '⚪'}
                        </span>
                        {active && (
                          <div style={{ position: 'absolute', bottom: '2px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--color-amber)' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(212, 168, 67, 0.08)' }}>
              <strong style={{ color: 'var(--color-amber)', display: 'block', marginBottom: '6px', fontSize: '11px' }}>Current Sheet Info:</strong>
              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '4px', fontSize: '10px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Status:</span>
                <span style={{ color: isSheetConfigured(`${activeScene}_${activeState}_${activeResolution}`) ? 'var(--color-jungle)' : 'var(--color-text-muted)' }}>
                  {isSheetConfigured(`${activeScene}_${activeState}_${activeResolution}`) ? '✅ Configured (Contains Keyframes/Static values)' : '⚪ Empty Sheet'}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>Sheet Name:</span>
                <code style={{ color: 'var(--color-amber)', wordBreak: 'break-all' }}>{activeScene}_{activeState}_{activeResolution}</code>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADVANCED COPY TOOL */}
        {activeTab === 'copy' && (
          <div style={{ padding: '12px' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '10px', marginBottom: '12px' }}>
              Duplicate keyframes from the current animated sheet to one or many other resolutions or states.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <strong style={{ color: 'var(--color-text-muted)', fontSize: '10px', display: 'block', marginBottom: '4px' }}>SOURCE SHEET (Copy From):</strong>
                <div style={{ padding: '8px', background: 'rgba(212, 168, 67, 0.1)', border: '1px solid var(--color-amber)', borderRadius: '6px', fontWeight: 'bold', color: 'var(--color-amber)' }}>
                  🎬 {copySource.split('_').slice(1).join(' ')}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>TARGET SHEETS (Copy To):</strong>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={handleSelectResolutionTargets} style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)', borderRadius: '3px', fontSize: '8px', cursor: 'pointer', padding: '2px 4px' }}>All Res</button>
                    <button onClick={handleSelectStateTargets} style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)', borderRadius: '3px', fontSize: '8px', cursor: 'pointer', padding: '2px 4px' }}>All States</button>
                    <button onClick={handleSelectAllTargets} style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-text-primary)', borderRadius: '3px', fontSize: '8px', cursor: 'pointer', padding: '2px 4px' }}>All 14</button>
                    <button onClick={handleClearTargets} style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--color-volcanic)', borderRadius: '3px', fontSize: '8px', cursor: 'pointer', padding: '2px 4px' }}>Clear</button>
                  </div>
                </div>

                <div style={{ 
                  maxHeight: '180px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', 
                  padding: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' 
                }}>
                  {states.map(s => (
                    <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 'bold', color: 'var(--color-amber)', textTransform: 'uppercase', paddingLeft: '4px' }}>
                        {s === 'transition_in' ? 'Intro' : s === 'idle' ? 'Idle' : 'Outro'}
                      </span>
                      {resolutions.map(r => {
                        const targetKey = `${activeScene}_${s}_${r}`;
                        const isSource = targetKey === copySource;
                        const hasAnim = isSheetConfigured(targetKey);
                        
                        if (isSource) return null;

                        return (
                          <label 
                            key={r} 
                            style={{ 
                              display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', borderRadius: '4px',
                              background: copyTargets[targetKey] ? 'rgba(212, 168, 67, 0.08)' : 'transparent',
                              cursor: 'pointer', transition: 'background 0.2s', fontSize: '10px'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={!!copyTargets[targetKey]} 
                              onChange={() => toggleTarget(targetKey)} 
                              style={{ accentColor: 'var(--color-amber)' }}
                            />
                            <span style={{ color: copyTargets[targetKey] ? 'var(--color-amber)' : 'var(--color-text-primary)' }}>
                              📐 {r}
                            </span>
                            {hasAnim && (
                              <span style={{ fontSize: '9px', color: 'rgba(76, 175, 80, 0.7)', marginLeft: 'auto' }}>🎬 Configured</span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={executeCopy}
              style={{ 
                width: '100%', marginTop: '16px', padding: '10px', 
                background: 'linear-gradient(135deg, var(--color-amber) 0%, #b88a2a 100%)', 
                color: '#0e1a16', border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(212, 168, 67, 0.25)', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.filter = 'brightness(1.15)';
                e.target.style.boxShadow = '0 6px 16px rgba(212, 168, 67, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.filter = 'none';
                e.target.style.boxShadow = '0 4px 12px rgba(212, 168, 67, 0.25)';
              }}
            >
              🚀 Copy Animations & Sync
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(212, 168, 67, 0.1)', background: 'rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button 
          onClick={() => alert("To show Transform Gizmos in 3D View:\n1. Click the 'Snapshot Camera Icon' inside Theatre.js Studio Outliner.\n2. Press W/E/R on your keyboard.")} 
          style={{ width: '100%', padding: '6px', background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}
        >
          ℹ️ Visual 3D Gizmos Guide
        </button>
      </div>
    </div>
  );
}
