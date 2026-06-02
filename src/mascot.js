import { mascotSvgString } from './components/mascot-svg.js';
import dinoFacts from './data/random-deet.json';

export function initInteractiveMascot() {
  const mascot = document.getElementById('mascot');
  if (!mascot) return;
  
  // Inject SVG into container
  const container = document.getElementById('mascot-svg-container');
  if (container && !document.getElementById('mascot-svg')) {
    container.innerHTML = mascotSvgString;
  }

  const svg = document.getElementById('mascot-svg');
  const fly = document.getElementById('mascot-fly');
  const mouth = document.getElementById('mascot-mouth');
  const bubble = document.getElementById('mascot-bubble');
  const text = document.getElementById('mascot-text');
  
  if (!svg) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let isIdle = false;
  let idleTimer = null;
  
  // Fly State Machine
  let flyState = 'hidden'; // 'hidden', 'entering', 'orbiting', 'exiting'
  
  let flyX = 0;
  let flyY = 0;
  let flyAngle = 0;
  let currentFlyCenterX = 300;
  let currentFlyCenterY = -500;
  let targetFlyCenterX = 300;
  let targetFlyCenterY = -500;

  // Sound synthesis for a hit/dizzy effect
  function playHitSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Boing/bonk sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.log('Audio not supported or blocked', e);
    }
  }

  // Handle tracking
  let currentEyeX = 0;
  let currentEyeY = 0;
  let currentHeadRot = 0;
  let targetEyeX = 0;
  let targetEyeY = 0;
  let targetHeadRot = 0;

  function updateLookTarget(targetX, targetY) {
    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = targetX - centerX;
    const dy = targetY - centerY;
    
    // Normalize direction
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxEyeDist = 12; 
    const maxHeadRot = 10; 
    
    if (dist > 5) {
      const dirX = dx / dist;
      const dirY = dy / dist;
      
      // Eyes point purely in the direction of the target
      targetEyeX = dirX * maxEyeDist;
      targetEyeY = dirY * maxEyeDist;
      
      // Head tilts based on vertical angle (clamped)
      let angle = Math.asin(dirY) * (180 / Math.PI);
      targetHeadRot = Math.max(-maxHeadRot, Math.min(maxHeadRot, angle));
    } else {
      targetEyeX = 0;
      targetEyeY = 0;
      targetHeadRot = 0;
    }
  }

  // Animation Loop
  let time = 0;
  function animate() {
    // Smooth lerping for eyes and head
    currentEyeX += (targetEyeX - currentEyeX) * 0.15;
    currentEyeY += (targetEyeY - currentEyeY) * 0.15;
    currentHeadRot += (targetHeadRot - currentHeadRot) * 0.15;

    svg.style.setProperty('--eye-x', `${currentEyeX}px`);
    svg.style.setProperty('--eye-y', `${currentEyeY}px`);
    svg.style.setProperty('--head-rot', `${currentHeadRot}deg`);
    svg.style.setProperty('--head-x', `${currentEyeX * 0.5}px`);
    svg.style.setProperty('--head-y', `${currentEyeY * 0.5}px`);

    if (flyState !== 'hidden') {
      time += 0.025; // fly speed
      
      // Smooth lerping for fly center
      currentFlyCenterX += (targetFlyCenterX - currentFlyCenterX) * 0.02;
      currentFlyCenterY += (targetFlyCenterY - currentFlyCenterY) * 0.02;

      // Base figure 8
      const baseX = Math.cos(time * 1.5) * 60;
      const baseY = Math.sin(time * 3.0) * 30;
      
      // Noise for organic chaotic flight
      const noiseX = Math.sin(time * 5.1) * 15 + Math.cos(time * 8.3) * 10;
      const noiseY = Math.cos(time * 4.7) * 15 + Math.sin(time * 7.9) * 10;
      
      // Calculate derivatives to find flight direction angle
      const dx = (-1.5 * Math.sin(time * 1.5) * 60) 
               + (5.1 * Math.cos(time * 5.1) * 15) 
               + (-8.3 * Math.sin(time * 8.3) * 10);
               
      const dy = (3.0 * Math.cos(time * 3.0) * 30)
               + (-4.7 * Math.sin(time * 4.7) * 15)
               + (7.9 * Math.cos(time * 7.9) * 10);
               
      const isFacingLeft = dx < 0;
      const rotation = Math.atan2(dy, Math.abs(dx)) * (180 / Math.PI);
      const scaleX = isFacingLeft ? -1 : 1;
      
      flyX = currentFlyCenterX + baseX + noiseX;
      flyY = currentFlyCenterY + baseY + noiseY;
      
      fly.style.transform = `translate(${flyX}px, ${flyY}px) scaleX(${scaleX}) rotate(${rotation}deg)`;
      
      // Make mascot look at the fly
      const rect = mascot.getBoundingClientRect();
      const globalFlyX = rect.left + flyX + 16;
      const globalFlyY = rect.top + flyY + 16;
      updateLookTarget(globalFlyX, globalFlyY);
      
      // Hide completely if exiting and far away off any edge
      if (flyState === 'exiting') {
         if (currentFlyCenterX > window.innerWidth + 100 || currentFlyCenterX < -250 || currentFlyCenterY < -window.innerHeight - 100) {
            flyState = 'hidden';
            fly.style.display = 'none';
         }
      }
    }
    requestAnimationFrame(animate);
  }
  
  // Blinking
  function blink() {
    svg.style.setProperty('--blink-scale', '0.1');
    setTimeout(() => {
      svg.style.setProperty('--blink-scale', '1');
    }, 150);
    setTimeout(blink, 2000 + Math.random() * 4000);
  }

  // Idle state handling
  function resetIdleTimer() {
    isIdle = false;
    if (flyState === 'orbiting' || flyState === 'entering') {
      flyState = 'exiting';
      // Pick a random exit direction
      const exitSide = Math.random();
      if (exitSide < 0.33) {
         targetFlyCenterX = window.innerWidth + 200; // right
         targetFlyCenterY = -window.innerHeight / 2;
      } else if (exitSide < 0.66) {
         targetFlyCenterX = -300; // left
         targetFlyCenterY = -window.innerHeight / 2;
      } else {
         targetFlyCenterX = window.innerWidth / 2; // top
         targetFlyCenterY = -window.innerHeight - 200;
      }
    }
    
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdle = true;
      if (flyState === 'hidden' || flyState === 'exiting') {
        flyState = 'entering';
        fly.style.display = 'block';
        
        // Pick a random entry direction
        const entrySide = Math.random();
        if (entrySide < 0.33) {
          currentFlyCenterX = window.innerWidth + 200; // right
          currentFlyCenterY = -window.innerHeight / 2;
        } else if (entrySide < 0.66) {
          currentFlyCenterX = -300; // left
          currentFlyCenterY = -window.innerHeight / 2;
        } else {
          currentFlyCenterX = window.innerWidth / 2; // top
          currentFlyCenterY = -window.innerHeight - 200;
        }
        
        // Fly towards near the dino first
        targetFlyCenterX = 150;
        targetFlyCenterY = -150;
        
        setTimeout(() => {
          if (isIdle) {
            flyState = 'orbiting';
            wanderFly();
          }
        }, 1500);
      } else {
        flyState = 'orbiting';
        wanderFly();
      }
    }, 5000); 
  }

  function wanderFly() {
    if (!isIdle || flyState !== 'orbiting') return;
    
    // 60% chance to stay close to the dino, 40% chance to roam far
    const isClose = Math.random() > 0.4;
    
    let minX, maxX, minY, maxY;
    if (isClose) {
      minX = -50;
      maxX = 350;
      minY = -350;
      maxY = 0;
    } else {
      minX = 100;
      maxX = window.innerWidth - 100;
      minY = -window.innerHeight + 100;
      maxY = -100;
    }
    
    targetFlyCenterX = minX + Math.random() * (maxX - minX);
    targetFlyCenterY = minY + Math.random() * (maxY - minY);
    
    setTimeout(wanderFly, 1500 + Math.random() * 2500);
  }

  window.addEventListener('mousemove', (e) => {
    if (flyState === 'hidden' || flyState === 'exiting') {
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateLookTarget(mouseX, mouseY);
    }
    resetIdleTimer();
  });

  // Click interaction (Single / Double Tap)
  let isDizzy = false;
  let showTimeout;
  let clickTimeout = null;
  let factDelayTimeout = null;
  let lastIndex = -1;

  function triggerFact() {
    clearTimeout(showTimeout);
    clearTimeout(factDelayTimeout);
    
    // Trigger anticipation reaction
    mascot.classList.remove('mascot--react');
    void mascot.offsetWidth; // trigger reflow
    mascot.classList.add('mascot--react');
    
    const showNewFact = () => {
      let idx;
      do {
        idx = Math.floor(Math.random() * dinoFacts.length);
      } while (idx === lastIndex && dinoFacts.length > 1);
      lastIndex = idx;
      
      const item = dinoFacts[idx];
      text.textContent = item.fact;
      bubble.classList.add('mascot__bubble--visible');
      showTimeout = setTimeout(() => bubble.classList.remove('mascot__bubble--visible'), 8000);
    };

    if (bubble.classList.contains('mascot__bubble--visible')) {
      bubble.classList.remove('mascot__bubble--visible');
      factDelayTimeout = setTimeout(showNewFact, 400); // Wait for CSS transition (0.4s) to finish
    } else {
      showNewFact();
    }
    
    resetIdleTimer();
  }

  function triggerDizzy() {
    if (isDizzy) return;
    isDizzy = true;
    
    clearTimeout(factDelayTimeout);
    playHitSound();
    svg.classList.add('mascot--dizzy');
    mascot.classList.add('mascot--dizzy');
    
    text.textContent = "Ouch! Seeing stars...";
    bubble.classList.add('mascot__bubble--visible');
    clearTimeout(showTimeout);
    
    setTimeout(() => {
      isDizzy = false;
      svg.classList.remove('mascot--dizzy');
      mascot.classList.remove('mascot--dizzy');
      showTimeout = setTimeout(() => bubble.classList.remove('mascot__bubble--visible'), 2000);
    }, 2500);
    
    resetIdleTimer();
  }

  mascot.addEventListener('click', (e) => {
    if (isDizzy) return;
    // Don't trigger a new fact if the click was inside the bubble itself
    if (e.target.closest('#mascot-bubble')) return;
    triggerFact();
  });

  mascot.addEventListener('dblclick', () => {
    triggerDizzy();
  });

  // Initialization
  blink();
  resetIdleTimer();
  animate();
  
  // Initial look at center
  setTimeout(() => updateLookTarget(window.innerWidth / 2, window.innerHeight / 2), 100);
}
