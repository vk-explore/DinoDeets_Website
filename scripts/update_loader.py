#!/usr/bin/env python3
"""Replace the old dino-loader block in all HTML files with the redesigned version."""

import re, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

NEW_LOADER = r'''    <!-- DINO LOADER START -->
    <style id="loader-styles">
      #dino-loader{position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:1;transition:opacity 0.6s ease;overflow:hidden;background:radial-gradient(ellipse at 50% 80%,#172922 0%,#0e1a16 50%,#070d0a 100%)}
      #dino-loader *{margin:0;padding:0;box-sizing:border-box}

      /* Starfield */
      .dl-stars{position:absolute;inset:0;overflow:hidden}
      .dl-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:dl-twinkle 2.5s infinite alternate ease-in-out}
      @keyframes dl-twinkle{0%{opacity:0.15;transform:scale(0.8)}100%{opacity:0.8;transform:scale(1.2)}}

      /* Central container */
      .dl-scene{position:relative;width:min(85vw,520px);display:flex;flex-direction:column;align-items:center;gap:20px}

      /* Loading text */
      .dl-title{font-family:'Titan One','Nunito',sans-serif;font-size:clamp(18px,4vw,26px);color:#d4a843;text-align:center;letter-spacing:1.5px;text-shadow:0 0 20px rgba(212,168,67,0.3);animation:dl-pulse-text 1.8s ease-in-out infinite alternate}
      @keyframes dl-pulse-text{0%{opacity:0.7;text-shadow:0 0 20px rgba(212,168,67,0.2)}100%{opacity:1;text-shadow:0 0 30px rgba(212,168,67,0.5)}}

      /* Track */
      .dl-track{width:100%;height:8px;background:rgba(255,255,255,0.06);border-radius:99px;position:relative;border:1px solid rgba(255,255,255,0.04)}
      .dl-bar{height:100%;width:0%;border-radius:99px;background:linear-gradient(90deg,#c17b2e,#d4a843,#f0c850);box-shadow:0 0 14px rgba(212,168,67,0.4);transition:width 80ms linear}

      /* Meteor */
      .dl-meteor{position:absolute;top:50%;left:0%;transform:translate(-50%,-50%);z-index:3;transition:left 80ms linear}
      .dl-meteor svg{display:block;filter:drop-shadow(0 0 6px rgba(255,140,40,0.6))}

      /* T-Rex */
      .dl-trex{position:absolute;top:50%;right:-42px;transform:translateY(-50%);z-index:2}
      .dl-trex svg{display:block;filter:drop-shadow(0 0 4px rgba(105,158,75,0.4))}

      /* Speech bubbles */
      .dl-bubble{padding:4px 10px;border-radius:12px;font-family:'Nunito',sans-serif;font-size:12px;font-weight:800;white-space:nowrap;position:absolute;bottom:calc(100% + 10px);left:50%;transform:translateX(-50%);box-shadow:0 3px 12px rgba(0,0,0,0.5);transition:all 0.25s ease;pointer-events:none;line-height:1.3}
      .dl-bubble--ast{background:linear-gradient(135deg,#ff9800,#e8652d);color:#fff;border:1px solid rgba(255,255,255,0.15)}
      .dl-bubble--trex{background:linear-gradient(135deg,#4caf50,#2e7d32);color:#fff;border:1px solid rgba(255,255,255,0.15)}
      .dl-bubble::after{content:'';position:absolute;top:100%;left:50%;margin-left:-5px;border:5px solid transparent}
      .dl-bubble--ast::after{border-top-color:#e8652d}
      .dl-bubble--trex::after{border-top-color:#2e7d32}

      /* Particles */
      .dl-particle{position:absolute;border-radius:50%;pointer-events:none;animation:dl-particle-fly 0.6s forwards ease-out}
      @keyframes dl-particle-fly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--px),var(--py)) scale(0)}}

      /* Impact flash */
      .dl-flash{position:absolute;top:50%;right:-42px;transform:translate(50%,-50%) scale(0);width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,60,0.9) 0%,rgba(232,101,45,0.5) 40%,transparent 70%);pointer-events:none;z-index:10}

      /* Percent label */
      .dl-pct{font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;color:rgba(255,255,255,0.35);letter-spacing:0.5px;margin-top:4px;transition:color 0.3s ease}

      body.dl-loading > *:not(#dino-loader):not(script):not(style):not(link){visibility:hidden !important}
    </style>
    <div id="dino-loader">
      <div class="dl-stars" id="dl-stars"></div>
      <div class="dl-scene">
        <p class="dl-title" id="dl-title">Traveling back in time…</p>
        <div class="dl-track" id="dl-track">
          <div class="dl-bar" id="dl-bar"></div>
          <div class="dl-meteor" id="dl-meteor">
            <span class="dl-bubble dl-bubble--ast" id="dl-abub">Here I come!</span>
            <!-- Stylized meteor with fiery tail -->
            <svg viewBox="0 0 80 36" width="56" height="25">
              <defs>
                <radialGradient id="mglow" cx="65%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="#ffeb3b" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#ff6f00" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="mtail" x1="0" y1="0.5" x2="0.7" y2="0.5">
                  <stop offset="0%" stop-color="#ffeb3b" stop-opacity="0"/>
                  <stop offset="40%" stop-color="#ff9800" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#e8652d" stop-opacity="0.8"/>
                </linearGradient>
              </defs>
              <!-- Outer glow -->
              <ellipse cx="58" cy="18" rx="22" ry="16" fill="url(#mglow)"/>
              <!-- Flame tail -->
              <path d="M0,14 Q20,8 40,12 Q50,14 56,18 Q50,22 40,24 Q20,28 0,22 Z" fill="url(#mtail)"/>
              <!-- Inner flame -->
              <path d="M18,15 Q35,11 50,16 Q55,18 50,20 Q35,25 18,21 Z" fill="#ff9800" opacity="0.6"/>
              <!-- Rock body -->
              <ellipse cx="58" cy="18" rx="12" ry="10" fill="#c35222"/>
              <ellipse cx="58" cy="18" rx="12" ry="10" fill="url(#mglow)" opacity="0.4"/>
              <!-- Craters -->
              <circle cx="54" cy="14" r="2.5" fill="#a33b17" opacity="0.7"/>
              <circle cx="62" cy="21" r="3" fill="#a33b17" opacity="0.6"/>
              <circle cx="56" cy="22" r="1.5" fill="#8b3015" opacity="0.5"/>
              <!-- Highlight -->
              <ellipse cx="56" cy="13" rx="4" ry="2" fill="#e8873d" opacity="0.5"/>
            </svg>
          </div>
          <div class="dl-trex" id="dl-trex">
            <span class="dl-bubble dl-bubble--trex" id="dl-tbub">Oh no!</span>
            <!-- Clean cartoon T-Rex silhouette -->
            <svg viewBox="0 0 50 56" width="40" height="45" style="transform:scaleX(-1)">
              <defs>
                <linearGradient id="trexg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#7ec55e"/>
                  <stop offset="100%" stop-color="#4a8c34"/>
                </linearGradient>
              </defs>
              <!-- Head -->
              <path d="M28,4 L44,2 L46,6 L44,10 L42,10 L40,12 L32,12 L28,10 Z" fill="url(#trexg)"/>
              <!-- Teeth -->
              <path d="M44,10 L42,13 L40,10 L38,13 L36,10" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
              <!-- Eye -->
              <circle cx="36" cy="6" r="2.5" fill="#1a2e1a"/>
              <circle cx="37" cy="5.5" r="0.8" fill="#fff"/>
              <!-- Neck -->
              <path d="M28,10 Q26,16 26,20 L30,20 Q32,16 32,12" fill="url(#trexg)"/>
              <!-- Body -->
              <ellipse cx="28" cy="28" rx="12" ry="10" fill="url(#trexg)"/>
              <!-- Tiny arms -->
              <path d="M34,22 Q38,24 37,27" fill="none" stroke="url(#trexg)" stroke-width="3" stroke-linecap="round"/>
              <!-- Tail -->
              <path d="M16,28 Q8,24 4,18 Q3,16 5,16 Q8,18 12,22 Q14,26 16,28" fill="url(#trexg)"/>
              <!-- Left leg -->
              <path d="M24,36 L22,46 L18,46 L18,48 L24,48 L26,38" fill="url(#trexg)"/>
              <!-- Right leg -->
              <path d="M32,36 L34,46 L30,46 L30,48 L36,48 L34,38" fill="url(#trexg)"/>
              <!-- Belly highlight -->
              <ellipse cx="28" cy="30" rx="7" ry="5" fill="#8fd46e" opacity="0.3"/>
              <!-- Back spines -->
              <path d="M18,20 L16,16 L20,20 M22,18 L21,14 L25,18 M26,18 L26,14 L29,18" fill="#5ea83e" opacity="0.6"/>
            </svg>
          </div>
          <div class="dl-flash" id="dl-flash"></div>
        </div>
        <span class="dl-pct" id="dl-pct">0%</span>
      </div>
    </div>
    <script>
    !function(){
      document.body.classList.add('dl-loading');
      var el=document.getElementById('dino-loader');
      if(!el)return;
      var bar=document.getElementById('dl-bar');
      var meteor=document.getElementById('dl-meteor');
      var tb=document.getElementById('dl-tbub');
      var ab=document.getElementById('dl-abub');
      var track=document.getElementById('dl-track');
      var flash=document.getElementById('dl-flash');
      var pct=document.getElementById('dl-pct');
      var title=document.getElementById('dl-title');
      var starsEl=document.getElementById('dl-stars');

      /* Generate starfield */
      for(var i=0;i<50;i++){
        var s=document.createElement('div');
        s.className='dl-star';
        s.style.left=Math.random()*100+'%';
        s.style.top=Math.random()*100+'%';
        s.style.width=s.style.height=(1+Math.random()*2)+'px';
        s.style.animationDelay=(Math.random()*3)+'s';
        s.style.animationDuration=(1.5+Math.random()*2)+'s';
        starsEl.appendChild(s);
      }

      var p=0,ready=false,t0=Date.now();
      var cols=['#ffeb3b','#ff9800','#e8652d','#ff6f00','#ffc107'];
      var phrases=[
        {at:0,t:'Oh no!'},
        {at:40,t:'Uh oh…'},
        {at:65,t:'RUN!!'},
        {at:85,t:'GULP!'}
      ];
      var mPhrases=[
        {at:0,t:'Here I come!'},
        {at:55,t:'Almost there!'},
        {at:80,t:'INCOMING!'}
      ];

      function particle(){
        if(p>92)return;
        var d=document.createElement('div');
        d.className='dl-particle';
        d.style.left=p+'%';d.style.top='50%';
        var size=2+Math.random()*3;
        d.style.width=d.style.height=size+'px';
        d.style.background=cols[Math.random()*cols.length|0];
        d.style.setProperty('--px',(Math.random()*24-12)+'px');
        d.style.setProperty('--py',(Math.random()*20+6)+'px');
        track.appendChild(d);
        setTimeout(function(){if(d.parentNode)d.parentNode.removeChild(d)},600);
      }

      function finish(){
        p=100;bar.style.width='100%';meteor.style.left='100%';
        pct.textContent='100%';pct.style.color='#d4a843';
        clearInterval(iv);
        /* Impact! */
        tb.textContent='BOOM!';tb.style.background='linear-gradient(135deg,#e8652d,#c62828)';
        ab.style.opacity='0';
        title.textContent='Welcome, Explorer!';title.style.color='#f0c850';
        /* Flash effect */
        flash.style.transition='transform 0.2s ease-out, opacity 0.4s ease';
        flash.style.transform='translate(50%,-50%) scale(1)';flash.style.opacity='1';
        setTimeout(function(){flash.style.opacity='0'},200);
        /* Screen shake */
        el.style.animation='dl-shake 0.3s ease';
        setTimeout(function(){
          el.style.opacity='0';
          setTimeout(function(){
            document.body.classList.remove('dl-loading');
            if(el.parentNode)el.parentNode.removeChild(el);
            var ls=document.getElementById('loader-styles');
            if(ls)ls.parentNode.removeChild(ls);
          },600);
        },450);
      }

      /* Add shake keyframe */
      var sheetEl=document.createElement('style');
      sheetEl.textContent='@keyframes dl-shake{0%,100%{transform:translate(0)}20%{transform:translate(-3px,2px)}40%{transform:translate(3px,-2px)}60%{transform:translate(-2px,3px)}80%{transform:translate(2px,-1px)}}';
      document.head.appendChild(sheetEl);

      var iv=setInterval(function(){
        if(ready&&p>=88){finish();return}
        p+=1.0+Math.random()*2.2;if(p>88)p=88;
        bar.style.width=p+'%';meteor.style.left=p+'%';
        pct.textContent=Math.round(p)+'%';
        particle();
        /* Update speech bubbles */
        for(var i=phrases.length-1;i>=0;i--){if(p>=phrases[i].at){tb.textContent=phrases[i].t;break}}
        for(var j=mPhrases.length-1;j>=0;j--){if(p>=mPhrases[j].at){ab.textContent=mPhrases[j].t;break}}
        if(p>=65){tb.style.background='linear-gradient(135deg,#ff9800,#e65100)'}
        if(p>=80){ab.style.background='linear-gradient(135deg,#ff1744,#d50000)';ab.textContent='INCOMING!'}
      },70);
      window.addEventListener('load',function(){
        var wait=Math.max(0,1500-(Date.now()-t0));
        setTimeout(function(){ready=true},wait);
      });
    }();
    </script>
    <!-- DINO LOADER END -->'''

# Pattern to match the entire loader block in each HTML file
pattern = re.compile(
    r'    <!-- DINO LOADER START -->.*?<!-- DINO LOADER END -->',
    re.DOTALL
)

html_files = glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True)

updated = []
for fpath in html_files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<!-- DINO LOADER START -->' not in content:
        continue
    new_content = pattern.sub(NEW_LOADER, content)
    if new_content != content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        updated.append(os.path.relpath(fpath, ROOT))

print(f"Updated {len(updated)} files:")
for f in sorted(updated):
    print(f"  ✓ {f}")
