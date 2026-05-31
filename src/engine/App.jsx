import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, PerspectiveCamera } from '@react-three/drei';
import { getProject } from '@theatre/core';
import { editable as e, SheetProvider } from '@theatre/r3f';
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension';

import { EditorUI } from './EditorUI';
import stateJson from '../data/animation-state.json';
import routesMap from '../data/routes.json';
import WebsiteRouter from '../website/WebsiteRouter';

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera');

// Check if we are on the scenebuilder endpoint (case-insensitive)
const isBuilder = window.location.pathname.toLowerCase().includes('/scenebuilder') || window.location.hash.toLowerCase().includes('#/scenebuilder');

let currentProjectId = 'DinoDeetsEngine_v1';

// Initialize Theatre.js Studio with the R3F extension only in builder mode
const actualStudio = studio.default || studio;
if (isBuilder) {
  actualStudio.extend(extension);
  actualStudio.initialize();
}

function getInitialData(stateData) {
  const rawState = Object.keys(stateData.engineState || {}).length > 0
    ? stateData.engineState
    : { activeScene: 'home', activeState: 'idle', activeResolution: '16:9', scenes: { home: { objects: [] } } };

  // Migrate state to include lights and cameras
  for (const sceneName in rawState.scenes) {
    const scene = rawState.scenes[sceneName];
    if (!scene.objects) scene.objects = [];
    if (!scene.lights) {
      scene.lights = [
        { id: 'light_ambient', type: 'ambient', intensity: 0.5, name: 'Ambient Light' },
        { id: 'light_sun', type: 'directional', intensity: 1, position: [5, 5, 5], name: 'Sun Light' }
      ];
    }
    if (!scene.camera) {
      scene.camera = { id: 'cam_main', fov: 50, position: [0, 0, 10], name: 'Main Camera' };
    }
  }

  // Auto-heal activeScene if it points to a non-existent scene
  const scenesList = Object.keys(rawState.scenes || {});
  if (scenesList.length > 0 && !rawState.scenes[rawState.activeScene]) {
    rawState.activeScene = scenesList[0];
  }

  const isolatedTheatreState = stateData.theatreState ? JSON.parse(JSON.stringify(stateData.theatreState)) : { sheetsById: {} };

  // Initialize Project (with HMR support)
  currentProjectId = 'DinoDeetsEngine_v' + (rawState.revision || 1);
  const projectConfig = isolatedTheatreState ? { state: isolatedTheatreState } : undefined;
  let animProject;
  if (window.__THEATRE_PROJECT) {
    animProject = window.__THEATRE_PROJECT;
  } else {
    animProject = getProject(currentProjectId, projectConfig);
    window.__THEATRE_PROJECT = animProject;
  }

  return { initialState: rawState, animProject };
}

// A helper component to load and render images as 3D Planes
class TextureErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Texture failed to load:", this.props.src, error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <e.mesh theatreKey={this.props.theatreKey}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="red" wireframe />
        </e.mesh>
      );
    }
    return this.props.children;
  }
}

// Global Canvas Error Boundary to catch R3F or Three.js WebGL crashes cleanly and preserve the builder UI sidebar
class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("3D Canvas rendering crashed:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          background: 'rgba(30, 14, 14, 0.95)', border: '2px dashed var(--color-volcanic)', 
          borderRadius: '12px', color: 'var(--color-text-primary)', padding: '30px', 
          zIndex: 9999, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          width: '500px', maxWidth: '85%', pointerEvents: 'auto'
        }}>
          <h2 style={{ color: 'var(--color-volcanic)', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>⚠️ 3D CANVAS RENDER ERROR</h2>
          <p style={{ maxWidth: '500px', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5', margin: '0 auto 15px auto' }}>
            The WebGL Three.js Canvas crashed. This is commonly caused by WebGL context loss, a missing asset source, or a React Three Fiber syntax issue.
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: '6px', fontSize: '11px',
            color: '#ff8888', maxWidth: '100%', overflowX: 'auto', textAlign: 'left', fontFamily: 'monospace',
            border: '1px solid rgba(232, 101, 45, 0.2)'
          }}>
            {this.state.error ? this.state.error.toString() : 'Unknown WebGL Error'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '20px', padding: '10px 20px', background: 'var(--color-volcanic)', 
              color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' 
            }}
          >
            🔄 Reload Developer Workspace
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ImagePlane({ objData, isBuilder }) {
  // Use Vite's base path for images
  const texturePath = '/DinoDeets_Website' + objData.src;
  const texture = useTexture(texturePath);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  
  return (
    <e.mesh 
      theatreKey={objData.id}
      onClick={(e) => {
        if (!isBuilder && objData.linkToRoute) {
          e.stopPropagation(); // prevent onPointerMissed click-through
          window.location.hash = '#' + objData.linkToRoute;
        }
      }}
    >
      <planeGeometry args={[aspect, 1]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.01} side={2} />
    </e.mesh>
  );
}

function SafeImagePlane({ objData, isBuilder }) {
  return (
    <TextureErrorBoundary src={objData.src} theatreKey={objData.id}>
      <Suspense fallback={null}>
        <ImagePlane objData={objData} isBuilder={isBuilder} />
      </Suspense>
    </TextureErrorBoundary>
  );
}

const clearTheatreCache = () => {
  return new Promise((resolve) => {
    // Clear localStorage synchronously
    Object.keys(localStorage).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('theatre') || lowerKey.includes('dinodeets') || lowerKey.includes('engine')) {
        localStorage.removeItem(key);
      }
    });

    const dbNames = ['Theatre.js Studio', 'Theatre.js core', 'DinoDeetsEngine'];
    let deletedCount = 0;

    const onComplete = () => {
      deletedCount++;
      if (deletedCount === dbNames.length) {
        resolve();
      }
    };

    if (window.indexedDB) {
      dbNames.forEach(dbName => {
        try {
          const req = window.indexedDB.deleteDatabase(dbName);
          req.onsuccess = onComplete;
          req.onerror = onComplete;
          req.onblocked = onComplete;
        } catch (e) {
          onComplete();
        }
      });
    } else {
      resolve();
    }
  });
};

export default function App({ externalState }) {
  const activeStateJson = externalState || stateJson;
  const { initialState, animProject } = getInitialData(activeStateJson);

  const initialHash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') || '/' : '/';

  const [engineState, setEngineState] = useState(initialState);
  const [activeScene, setActiveScene] = useState(isBuilder ? (initialState.activeScene || 'home') : (routesMap[initialHash] || 'home'));
  const [activeState, setActiveState] = useState(isBuilder ? (initialState.activeState || 'idle') : 'transition_in');
  const [activeResolution, setActiveResolution] = useState(initialState.activeResolution || '16:9');
  const [sidebarWidth, setSidebarWidth] = useState(isBuilder ? 330 : 0);

  // Debug boot status log
  console.warn("🛠️ [App] Loaded state. isBuilder:", isBuilder, "sidebarWidth:", isBuilder ? 330 : 0);

  const [currentRoute, setCurrentRoute] = useState(initialHash);
  const [pendingRoute, setPendingRoute] = useState(null);

  // React Ref to hold the up-to-date master theatre state across saving operations
  const masterTheatreStateRef = useRef(activeStateJson.theatreState || { sheetsById: {} });

  // Dynamic Theatre Sheet based on Scene + State + Resolution
  const sheetName = `${activeScene}_${activeState}_${activeResolution}`;
  const sheet = animProject.sheet(sheetName);

  // Handle Non-Builder Routing & Theatre Sequence Orchestration
  useEffect(() => {
    if (isBuilder) return;
    const handleHashChange = () => {
      const newRoute = window.location.hash.replace('#', '') || '/';
      if (newRoute !== currentRoute) {
        setPendingRoute(newRoute);
        setActiveState('transition_out');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isBuilder, currentRoute]);

  useEffect(() => {
    if (isBuilder || !sheet) return;
    let isCancelled = false;
    
    const playSequence = async () => {
      if (activeState === 'transition_in') {
        await sheet.sequence.play({ iterationCount: 1, direction: 'normal' });
        if (!isCancelled) setActiveState('idle');
      } else if (activeState === 'idle') {
        sheet.sequence.play({ iterationCount: Infinity, direction: 'normal' });
      } else if (activeState === 'transition_out') {
        await sheet.sequence.play({ iterationCount: 1, direction: 'normal' });
        if (!isCancelled && pendingRoute) {
          setCurrentRoute(pendingRoute);
          setActiveScene(routesMap[pendingRoute] || 'home');
          setActiveState('transition_in');
          setPendingRoute(null);
        }
      }
    };
    
    playSequence();
    
    return () => {
      isCancelled = true;
      sheet.sequence.pause();
    };
  }, [isBuilder, activeState, sheet, pendingRoute]);

  // Re-render when switching scenes
  const sceneData = engineState.scenes[activeScene] || { objects: [], lights: [], camera: null };

  const aspectRatios = {
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '1:1': 1,
    '4:3': 4 / 3,
    '3:4': 3 / 4,
  };
  const currentRatio = aspectRatios[activeResolution];

  const mergeTheatreState = (currentTheatreState) => {
    // Clone the master ref state which holds all sheets across the project
    const masterTheatreState = JSON.parse(JSON.stringify(masterTheatreStateRef.current || { sheetsById: {} }));
    if (!masterTheatreState.sheetsById) masterTheatreState.sheetsById = {};
    
    // Overlay only the sheets active/modified in the current Theatre Studio memory session
    if (currentTheatreState?.sheetsById) {
      Object.keys(currentTheatreState.sheetsById).forEach(key => {
        masterTheatreState.sheetsById[key] = JSON.parse(JSON.stringify(currentTheatreState.sheetsById[key]));
      });
    }
    
    // Also merge other top-level fields from currentTheatreState if they exist (e.g. definitionVersion)
    if (currentTheatreState) {
      Object.keys(currentTheatreState).forEach(key => {
        if (key !== 'sheetsById') {
          masterTheatreState[key] = currentTheatreState[key];
        }
      });
    }
    return masterTheatreState;
  };

  const saveState = async () => {
    if (!isBuilder) return;
    const currentTheatreState = actualStudio.createContentOfSaveFile(currentProjectId);
    const masterTheatreState = mergeTheatreState(currentTheatreState);
    const res = await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState: masterTheatreState, engineState })
    });
    if (res.ok) {
      masterTheatreStateRef.current = masterTheatreState;
    }
    return res.ok;
  };

  const handleSwitchContext = async (newScene, newState, newRes) => {
    if (newScene !== activeScene || newState !== activeState || newRes !== activeResolution) {
      const currentTheatreState = actualStudio.createContentOfSaveFile(currentProjectId);
      const masterTheatreState = mergeTheatreState(currentTheatreState);
      const nextEngineState = { ...engineState, activeScene: newScene, activeState: newState, activeResolution: newRes };

      await fetch('/DinoDeets_Website/api/save-animation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theatreState: masterTheatreState, engineState: nextEngineState })
      });
      
      await clearTheatreCache();
      window.location.reload();
    }
  };

  // Auto-save ONLY when scene structural components (objects/lights/cameras) change
  useEffect(() => {
    if (isBuilder) {
      const timer = setTimeout(() => saveState(), 1500);
      return () => clearTimeout(timer);
    }
  }, [engineState.scenes]);

  const handleAddAsset = (src) => {
    // name without path and extension for display
    const baseName = src.split('/').pop().split('.')[0];
    const safeName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    const id = safeName + '_' + Math.random().toString(36).substr(2, 4);
    const newObj = { id, src, name: baseName, linkToRoute: '' };
    
    setEngineState(prev => {
      const newState = { ...prev, scenes: { ...prev.scenes } };
      newState.scenes[activeScene] = {
        ...newState.scenes[activeScene],
        objects: [...newState.scenes[activeScene].objects, newObj]
      };
      return newState;
    });
  };

  const handleUpdateObject = (objId, updates) => {
    setEngineState(prev => {
      const newState = { ...prev, scenes: { ...prev.scenes } };
      const updatedScene = { ...newState.scenes[activeScene] };
      const sceneObjects = [...updatedScene.objects];
      const index = sceneObjects.findIndex(o => o.id === objId);
      if (index >= 0) {
        sceneObjects[index] = { ...sceneObjects[index], ...updates };
      }
      updatedScene.objects = sceneObjects;
      newState.scenes[activeScene] = updatedScene;
      return newState;
    });
  };

  const handleDeleteScene = async (sceneName) => {
    const newEngineState = { ...engineState, scenes: { ...engineState.scenes } };
    delete newEngineState.scenes[sceneName];
    
    const remaining = Object.keys(newEngineState.scenes);
    let nextActive = activeScene;
    if (remaining.length === 0) {
      newEngineState.scenes['home'] = { 
        objects: [], 
        lights: [
          { id: 'light_ambient', type: 'ambient', intensity: 0.5, name: 'Ambient Light' },
          { id: 'light_sun', type: 'directional', intensity: 1, position: [5, 5, 5], name: 'Sun Light' }
        ], 
        camera: { id: 'cam_main', fov: 50, position: [0, 0, 10], name: 'Main Camera' } 
      };
      nextActive = 'home';
    } else if (activeScene === sceneName) {
      nextActive = remaining[0];
    }
    
    newEngineState.activeScene = nextActive;
    newEngineState.revision = (engineState.revision || 1) + 1;
    
    const currentTheatreState = actualStudio.createContentOfSaveFile(currentProjectId);
    const masterTheatreState = mergeTheatreState(currentTheatreState);
    
    Object.keys(masterTheatreState.sheetsById || {}).forEach(key => {
      if (key.startsWith(`${sceneName}_`)) {
        delete masterTheatreState.sheetsById[key];
      }
    });

    // Always save and reload because Theatre.js creates empty sheets in memory 
    // that don't appear in sheetsById until animated, and they won't disappear unless we reload.
    await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState: masterTheatreState, engineState: newEngineState })
    });

    await clearTheatreCache();
    alert("Scene deleted! Page will reload to clear Theatre.js cache.");
    window.location.reload();
  };

  const handleAddScene = async (name) => {
    if (!name || engineState.scenes[name]) return;
    
    const newEngineState = { 
      ...engineState, 
      activeScene: name, 
      revision: (engineState.revision || 1) + 1,
      scenes: { 
        ...engineState.scenes,
        [name]: { 
          objects: [], 
          lights: [
            { id: 'light_ambient', type: 'ambient', intensity: 0.5, name: 'Ambient Light' },
            { id: 'light_sun', type: 'directional', intensity: 1, position: [5, 5, 5], name: 'Sun Light' }
          ], 
          camera: { id: 'cam_main', fov: 50, position: [0, 0, 10], name: 'Main Camera' } 
        } 
      } 
    };

    const currentTheatreState = actualStudio.createContentOfSaveFile(currentProjectId);
    const masterTheatreState = mergeTheatreState(currentTheatreState);

    await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState: masterTheatreState, engineState: newEngineState })
    });

    await clearTheatreCache();
    alert("Scene added! Page will reload to initialize Theatre.js sheets.");
    window.location.reload();
  };

  const handleRenameScene = async (oldName, newName) => {
    if (!newName || oldName === newName || engineState.scenes[newName]) return;
    
    const newEngineState = { ...engineState, revision: (engineState.revision || 1) + 1, scenes: { ...engineState.scenes } };
    newEngineState.scenes[newName] = newEngineState.scenes[oldName];
    delete newEngineState.scenes[oldName];
    
    if (activeScene === oldName) {
      newEngineState.activeScene = newName;
    }

    const currentTheatreState = actualStudio.createContentOfSaveFile(currentProjectId);
    const masterTheatreState = mergeTheatreState(currentTheatreState);
    
    Object.keys(masterTheatreState.sheetsById || {}).forEach(key => {
      if (key.startsWith(`${oldName}_`)) {
        const newKey = key.replace(`${oldName}_`, `${newName}_`);
        masterTheatreState.sheetsById[newKey] = masterTheatreState.sheetsById[key];
        delete masterTheatreState.sheetsById[key];
      }
    });

    await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState: masterTheatreState, engineState: newEngineState })
    });

    await clearTheatreCache();
    alert("Scene renamed! Page will reload to apply Theatre.js updates.");
    window.location.reload();
  };

  const handleRemoveAsset = (id) => {
    setEngineState(prev => {
      const newState = { ...prev, scenes: { ...prev.scenes } };
      newState.scenes[activeScene] = {
        ...newState.scenes[activeScene],
        objects: newState.scenes[activeScene].objects.filter(o => o.id !== id)
      };
      return newState;
    });
  };

  const handleAddLight = (type) => {
    const id = 'light_' + Math.random().toString(36).substr(2, 6);
    const newLight = { id, type, intensity: 1, position: [0, 5, 0], name: `${type} Light` };
    setEngineState(prev => {
      const newState = { ...prev, scenes: { ...prev.scenes } };
      newState.scenes[activeScene] = {
        ...newState.scenes[activeScene],
        lights: [...newState.scenes[activeScene].lights, newLight]
      };
      return newState;
    });
  };

  const handleRemoveLight = (id) => {
    setEngineState(prev => {
      const newState = { ...prev, scenes: { ...prev.scenes } };
      newState.scenes[activeScene] = {
        ...newState.scenes[activeScene],
        lights: newState.scenes[activeScene].lights.filter(l => l.id !== id)
      };
      return newState;
    });
  };

  // Copy animation frames across resolutions/states
  const handleCopyAnimations = async (sourceSheetName, targetSheetNames) => {
    if (!targetSheetNames || targetSheetNames.length === 0) {
      alert("No target sheets selected for copying!");
      return;
    }
    
    const nextEngineState = { ...engineState, revision: (engineState.revision || 1) + 1 };
    
    // Auto-save the current Theatre.js state before copying
    const currentTheatreState = actualStudio.createContentOfSaveFile(currentProjectId);
    const masterTheatreState = mergeTheatreState(currentTheatreState);
    
    const sourceData = masterTheatreState.sheetsById[sourceSheetName];
    if (!sourceData) {
      alert(`Source sheet "${sourceSheetName}" does not have any keyframes or overrides to copy! Please record some animations first.`);
      return;
    }
    
    targetSheetNames.forEach(targetName => {
      masterTheatreState.sheetsById[targetName] = JSON.parse(JSON.stringify(sourceData));
    });
    
    const res = await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState: masterTheatreState, engineState: nextEngineState })
    });
    
    if (res.ok) {
      masterTheatreStateRef.current = masterTheatreState;
      
      await clearTheatreCache();
      
      alert(`Copied animation from "${sourceSheetName.split('_').slice(1).join(' ')}" to ${targetSheetNames.length} target sheet(s) successfully! Page will reload to load the new animations.`);
      window.location.reload();
    } else {
      alert("Failed to save and copy animations.");
    }
  };

  const handleSelectObject = (theatreKey) => {
    console.log("To edit", theatreKey, "please select it directly in the Theatre.js Outliner on the right.");
  };

  return (
    <>
      {isBuilder && (
        <EditorUI 
          engineState={engineState}
          activeScene={activeScene}
          activeState={activeState}
          activeResolution={activeResolution}
          onSwitchContext={handleSwitchContext}
          onAddScene={handleAddScene}
          onDeleteScene={handleDeleteScene}
          onRenameScene={handleRenameScene}
          onAddAsset={handleAddAsset}
          onRemoveAsset={handleRemoveAsset}
          onAddLight={handleAddLight}
          onRemoveLight={handleRemoveLight}
          onSelectObject={handleSelectObject}
          onUpdateObject={handleUpdateObject}
          masterTheatreState={masterTheatreStateRef.current}
          onCopyAnimations={handleCopyAnimations}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
        />
      )}
      
      {/* LAYER 2: HTML Content (Underneath) */}
      <div 
        id="layer-2-html"
        style={{
          position: 'absolute',
          top: 0,
          left: `${sidebarWidth}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
          height: '100vh',
          zIndex: 5,
          overflowY: 'auto',
          backgroundColor: 'var(--color-bg-primary)',
          backgroundImage: isBuilder ? `
            linear-gradient(to right, rgba(212, 168, 67, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212, 168, 67, 0.05) 1px, transparent 1px)
          ` : 'none',
          backgroundSize: '50px 50px',
          backgroundPosition: 'center center'
        }}
      >
        {isBuilder ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}>
            {/* Center crosshair */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.25 }}>
              <div style={{ width: '40px', height: '2px', background: 'var(--color-amber)' }} />
              <div style={{ width: '2px', height: '40px', background: 'var(--color-amber)', marginTop: '-21px' }} />
              <span style={{ fontSize: '9px', color: 'var(--color-amber)', fontFamily: 'monospace', marginTop: '6px' }}>[0, 0] Center Point</span>
            </div>
            
            {/* Alignment specs label */}
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(14, 26, 22, 0.8)', border: '1px solid rgba(212, 168, 67, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '9px', fontFamily: 'monospace', color: 'var(--color-amber)', zIndex: 12 }}>
              📐 ALIGNMENT VIEWPORT GRID (50px increments)
            </div>
          </div>
        ) : (
          <WebsiteRouter activeRoute={currentRoute} />
        )}
      </div>
 
      {/* LAYER 1: 3D Overlay (On Top) */}
      <div 
        id="layer-1-3d" 
        style={{ 
          position: 'absolute',
          top: 0,
          left: `${sidebarWidth}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
          height: '100vh',
          zIndex: 10,
          overflow: 'hidden'
        }}
      >
        
        {/* Aspect Ratio Bounds Overlay (Only visible in builder) */}
        {isBuilder && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            aspectRatio: currentRatio, 
            width: currentRatio > (window.innerWidth - sidebarWidth) / window.innerHeight ? `calc(100vw - ${sidebarWidth}px)` : 'auto',
            height: currentRatio > (window.innerWidth - sidebarWidth) / window.innerHeight ? 'auto' : '100vh',
            pointerEvents: 'none', zIndex: 11,
            boxShadow: '0 0 0 4000px rgba(0,0,0,0.85)',
            border: '2px solid #f59e0b',
            transition: 'all 0.3s ease'
          }} />
        )}
 
        <CanvasErrorBoundary>
          <Canvas 
            gl={{ alpha: true }} 
            style={{ width: `calc(100vw - ${sidebarWidth}px)`, height: '100vh', background: 'transparent' }}
            onPointerMissed={(e) => {
              if (isBuilder) return;
              // Forward click to Layer 2 HTML beneath the Canvas
              const htmlLayer = document.getElementById('layer-2-html');
              if (htmlLayer && e.target && e.target.style) {
                const canvasEl = e.target;
                const prevPointerEvents = canvasEl.style.pointerEvents;
                canvasEl.style.pointerEvents = 'none'; // Temporarily disable canvas pointer events
                const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
                canvasEl.style.pointerEvents = prevPointerEvents; // Restore immediately
                
                if (elementUnder && elementUnder !== htmlLayer) {
                  elementUnder.click();
                }
              }
            }}
          >
            <SheetProvider key={sheetName} sheet={sheet}>
              {sceneData.camera && (
                <EditableCamera theatreKey={sceneData.camera.name} makeDefault position={sceneData.camera.position} fov={sceneData.camera.fov} />
              )}
              
              {sceneData.lights.map(light => {
                if (light.type === 'ambient') return <e.ambientLight key={light.id} theatreKey={light.name} intensity={light.intensity} />;
                if (light.type === 'directional') return <e.directionalLight key={light.id} theatreKey={light.name} position={light.position} intensity={light.intensity} />;
                if (light.type === 'point') return <e.pointLight key={light.id} theatreKey={light.name} position={light.position} intensity={light.intensity} />;
                return null;
              })}
              
              <Suspense fallback={null}>
                {sceneData.objects.map(obj => (
                  <SafeImagePlane key={obj.id} objData={obj} isBuilder={isBuilder} />
                ))}
              </Suspense>
            </SheetProvider>
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </>
  );
}
