import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { getProject } from '@theatre/core';
import { editable as e, SheetProvider } from '@theatre/r3f';
import studio from '@theatre/studio';
import extension from '@theatre/r3f/dist/extension';

import { EditorUI } from './EditorUI';
import stateJson from '../data/animation-state.json';

// Check if we are on the scenebuilder endpoint
const isBuilder = window.location.pathname.includes('/scenebuilder') || window.location.hash.includes('#/scenebuilder');

// Initialize Theatre.js Studio with the R3F extension only in builder mode
const actualStudio = studio.default || studio;
if (import.meta.env.DEV && isBuilder) {
  actualStudio.extend(extension);
  actualStudio.initialize();
}

// Load or default state
const rawState = Object.keys(stateJson.engineState || {}).length > 0
  ? stateJson.engineState
  : { activeScene: 'Home', scenes: { Home: { objects: [] } } };

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
const initialState = rawState;

// Initialize Project
const projectConfig = Object.keys(stateJson.theatreState || {}).length > 0 ? { state: stateJson.theatreState } : undefined;
let animProject;
try {
  animProject = getProject('DinoDeetsEngine', projectConfig);
} catch (e) {
  // Catch HMR reloads
  animProject = getProject('DinoDeetsEngine');
}

// A helper component to load and render images as 3D Planes
function ImagePlane({ objData }) {
  // Use Vite's base path for images
  const texture = useTexture('/DinoDeets_Website' + objData.src);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  
  return (
    <e.mesh theatreKey={objData.id}>
      <planeGeometry args={[aspect * 5, 5]} />
      <meshStandardMaterial map={texture} transparent side={2} />
    </e.mesh>
  );
}

export default function App() {
  const [engineState, setEngineState] = useState(initialState);
  const [activeScene, setActiveScene] = useState(initialState.activeScene || 'Home');
  const [activeState, setActiveState] = useState('idle');
  const [activeResolution, setActiveResolution] = useState('16:9');

  // Re-render when switching scenes
  const sceneData = engineState.scenes[activeScene] || { objects: [] };
  
  // Dynamic Theatre Sheet based on Scene + State + Resolution
  const sheetName = `${activeScene}_${activeState}_${activeResolution}`;
  const sheet = animProject.sheet(sheetName);

  const aspectRatios = {
    '16:9': 16 / 9,
    '9:16': 9 / 16,
    '1:1': 1,
    '4:3': 4 / 3,
    '3:4': 3 / 4,
  };
  const currentRatio = aspectRatios[activeResolution];

  const saveState = async () => {
    if (!isBuilder) return;
    const theatreState = actualStudio.createContentOfSaveFile('DinoDeetsEngine');
    const res = await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState, engineState })
    });
    return res.ok;
  };

  // Auto-save when engine configuration changes
  useEffect(() => {
    if (isBuilder) {
      const timer = setTimeout(() => {
        saveState();
      }, 1500); // debounce 1.5s
      return () => clearTimeout(timer);
    }
  }, [engineState, activeScene, activeState, activeResolution]);

  const handleAddAsset = (src) => {
    const id = 'obj_' + Math.random().toString(36).substr(2, 6);
    // name without path and extension for display
    const baseName = src.split('/').pop().split('.')[0];
    const newObj = { id, src, name: baseName, linkToScene: null };
    
    setEngineState(prev => {
      const newState = { ...prev };
      newState.scenes[activeScene].objects.push(newObj);
      return newState;
    });
  };

  const handleRemoveAsset = (id) => {
    setEngineState(prev => {
      const newState = { ...prev };
      newState.scenes[activeScene].objects = newState.scenes[activeScene].objects.filter(o => o.id !== id);
      return newState;
    });
  };

  const handleAddLight = (type) => {
    const id = 'light_' + Math.random().toString(36).substr(2, 6);
    const newLight = { id, type, intensity: 1, position: [0, 5, 0], name: `${type} Light` };
    setEngineState(prev => {
      const newState = { ...prev };
      newState.scenes[activeScene].lights.push(newLight);
      return newState;
    });
  };

  const handleRemoveLight = (id) => {
    setEngineState(prev => {
      const newState = { ...prev };
      newState.scenes[activeScene].lights = newState.scenes[activeScene].lights.filter(l => l.id !== id);
      return newState;
    });
  };

  // Helper to copy animation frames across resolutions (stubbed for later)
  const copyAnimationsToAll = async () => {
    // We will save state, manipulate JSON, and push it back.
    alert("Saving current state and copying to other resolutions...");
    const theatreState = actualStudio.createContentOfSaveFile('DinoDeetsEngine');
    
    // Copy logic
    const baseSheetName = `${activeScene}_${activeState}_${activeResolution}`;
    const baseData = theatreState.sheetsById[baseSheetName];
    if (baseData) {
      ['16:9', '9:16', '1:1', '4:3', '3:4'].forEach(res => {
        if (res !== activeResolution) {
          theatreState.sheetsById[`${activeScene}_${activeState}_${res}`] = JSON.parse(JSON.stringify(baseData));
        }
      });
    }

    const res = await fetch('/DinoDeets_Website/api/save-animation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theatreState, engineState })
    });
    if (res.ok) alert("Copied! Please refresh the page to load the new animations.");
  };

  const handleSelectObject = (theatreKey) => {
    if (isBuilder && actualStudio && sheet) {
      try {
        const obj = sheet.object(theatreKey, {});
        if (typeof actualStudio.setSelection === 'function') {
          actualStudio.setSelection([obj]);
        } else {
          alert("Error: actualStudio.setSelection is not a function. Available keys: " + Object.keys(actualStudio).join(', '));
        }
      } catch (e) {
        alert("Selection error: " + e.message);
        console.error("Could not select object:", e);
      }
    }
  };

  return (
    <>
      {isBuilder && (
        <EditorUI 
          engineState={engineState}
          activeScene={activeScene}
          activeState={activeState}
          activeResolution={activeResolution}
          onSceneChange={setActiveScene}
          onStateChange={setActiveState}
          onResolutionChange={setActiveResolution}
          onAddAsset={handleAddAsset}
          onRemoveAsset={handleRemoveAsset}
          onAddLight={handleAddLight}
          onRemoveLight={handleRemoveLight}
          onSelectObject={handleSelectObject}
          copyAnimationsToAll={copyAnimationsToAll}
        />
      )}
      
      {/* LAYER 2: HTML Content (Underneath) */}
      <div id="layer-2-html">
        <div style={{ padding: '50px', color: 'white', textAlign: 'center' }}>
          <h1>Layer 2 - HTML Content</h1>
          <p>This content sits underneath the 3D canvas.</p>
          <p>Current Scene: {activeScene}</p>
        </div>
      </div>

      {/* LAYER 1: 3D Overlay (On Top) */}
      <div id="layer-1-3d" style={{ overflow: 'hidden' }}>
        
        {/* Aspect Ratio Bounds Overlay (Only visible in builder) */}
        {isBuilder && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            aspectRatio: currentRatio, 
            width: currentRatio > window.innerWidth / window.innerHeight ? '100vw' : 'auto',
            height: currentRatio > window.innerWidth / window.innerHeight ? 'auto' : '100vh',
            pointerEvents: 'none', zIndex: 11,
            boxShadow: '0 0 0 4000px rgba(0,0,0,0.85)',
            border: '2px solid #f59e0b',
            transition: 'all 0.3s ease'
          }} />
        )}

        <Canvas gl={{ alpha: true }} style={{ width: '100vw', height: '100vh', background: 'transparent' }}>
          <SheetProvider sheet={sheet}>
            {sceneData.camera && (
              <e.perspectiveCamera theatreKey={sceneData.camera.name} makeDefault position={sceneData.camera.position} fov={sceneData.camera.fov} />
            )}
            
            {sceneData.lights.map(light => {
              if (light.type === 'ambient') return <e.ambientLight key={light.id} theatreKey={light.name} intensity={light.intensity} />;
              if (light.type === 'directional') return <e.directionalLight key={light.id} theatreKey={light.name} position={light.position} intensity={light.intensity} />;
              if (light.type === 'point') return <e.pointLight key={light.id} theatreKey={light.name} position={light.position} intensity={light.intensity} />;
              return null;
            })}
            
            <Suspense fallback={null}>
              {sceneData.objects.map(obj => (
                <ImagePlane key={obj.id} objData={obj} />
              ))}
            </Suspense>
          </SheetProvider>
        </Canvas>
      </div>
    </>
  );
}
