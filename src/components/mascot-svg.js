export const mascotSvgString = `
      <svg id="mascot-svg" class="mascot__img" xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 700 700" xmlns:bx="https://boxy-svg.com" width="100%" height="100%">
        <defs><bx:export><bx:file format="svg"/></bx:export></defs>
        
        <g><title>Body</title><path d="M 32.422 496.673 C 48.672 142.384 107.684 80.197 237.587 80.197 L 232.659 492.757 L 32.422 496.673 Z" fill="#699e4b" style="stroke-width: 2.07;"/><path d="M 56.816 311.386 L 22.213 325.059 L 53.142 360.55 L 56.816 311.386 Z" fill="#1a422b" style="stroke-width: 2.07;"/><path d="M 69.568 237.404 L 37.085 251.76 L 59.9 289.303 L 69.568 237.404 Z" fill="#1a422b" style="stroke-width: 2.07;"/><path d="M 95.017 168.135 L 60.219 178.352 L 78.601 208.505 L 95.017 168.135 Z" fill="#1a422b" style="stroke-width: 2.07;"/><path d="M 47.328 390.057 L 10.289 405.526 L 43.395 445.678 L 47.328 390.057 Z" fill="#1a422b" style="stroke-width: 2.07;"/><path d="M 123.656 123.924 L 94.472 122.928 L 100.577 151.909 L 123.656 123.924 Z" fill="#1a422b" style="stroke-width: 2.07;"/></g>
        
        <!-- Head Group wrapped for animation -->
        <g id="mascot-head" style="transform-origin: 210px 150px; transform: rotate(var(--head-rot, 0deg)) translate(var(--head-x, 0px), var(--head-y, 0px));">
          <path d="M 96.892 194.913 C 95.409 88.721 197.351 64.518 311.2 56.843 C 463.789 46.556 472.458 161.491 459.293 219.87 C 446.128 278.249 425.766 304.249 271.153 304.557 C 116.54 304.865 98.115 282.451 96.892 194.913 Z" fill="#699e4b" style="stroke-width: 2.07;"><title>Head</title></path>
          <circle cx="100" cy="105" r="14" fill="#e8652d" opacity="0.8" transform="matrix(2.016734, 0, 0, 2.122438, 17.634478, -2.17707)"><title>Blush</title></circle>
          <path id="mascot-mouth" d="M 270.649 236.945 C 331.151 272.319 384.93 265.245 431.987 215.721" fill="none" stroke="#0e1a16" stroke-width="4" stroke-linecap="round" style="transition: d 0.2s ease-out; stroke-width: 8.278;"><title>Mouth</title></path>
          <g><title>Teeth</title><polygon points="326.556 261.297 334.519 282.454 348.237 260.466" fill="#ffffff" style="stroke-width: 2.04;"/><polygon points="368.57 258.754 382.752 272.276 389.434 251.264" fill="#ffffff" style="stroke-width: 2.04;"/><polygon points="402.369 245.9 415.785 256.956 422.271 231.181" fill="#ffffff" style="stroke-width: 2.04;"/></g>
          
          <g class="mascot-eye" style="transform-origin: 130px 65px;" transform="matrix(2.016734, 0, 0, 2.122438, 109.014153, 63.660152)"><title>R_Eye</title>
            <g style="transform-origin: 130px 65px; transform: scaleY(var(--blink-scale, 1));">
              <circle cx="130" cy="65" r="22" fill="#ffffff"/>
              <g class="mascot-pupil" style="transform-origin: 130px 65px; transition: opacity 0.3s ease;">
                <circle cx="130" cy="65" r="8" fill="#0e1a16" style="transform-origin: 130px 65px; transform: translate(var(--eye-x, 0px), var(--eye-y, 0px));"/>
                <circle cx="127" cy="62" r="3" fill="#ffffff" style="transform-origin: 130px 65px; transform: translate(var(--eye-x, 0px), var(--eye-y, 0px));"/>
              </g>
            </g>
          </g>
          
          <g class="mascot-eye" style="transform-origin: 170px 55px;" transform="matrix(2.016734, 0, 0, 2.122438, 153.635391, 58.502743)"><title>L_Eye</title>
            <g style="transform-origin: 170px 55px; transform: scaleY(var(--blink-scale, 1));">
              <circle cx="170" cy="55" r="16" fill="#ffffff"/>
              <g class="mascot-pupil" style="transform-origin: 170px 55px; transition: opacity 0.3s ease;">
                <circle cx="170" cy="55" r="6" fill="#0e1a16" style="transform-origin: 170px 55px; transform: translate(var(--eye-x, 0px), var(--eye-y, 0px));"/>
                <circle cx="168" cy="53" r="2" fill="#ffffff" style="transform-origin: 170px 55px; transform: translate(var(--eye-x, 0px), var(--eye-y, 0px));"/>
              </g>
            </g>
          </g>
        </g>
      </svg>
`;
