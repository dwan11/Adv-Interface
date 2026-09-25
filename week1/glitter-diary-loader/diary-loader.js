/**
 * DiaryLoader — a sticker-scrapbook diary that works as a progress indicator.
 *
 *   Determinate   0%    : stickers sit still; LOADING is only a faint pencil guide
 *                 1–99% : pages flip, stickers tip to +10° / −10° with every page,
 *                         and the letters of LOADING are pressed on one by one as progress rises
 *                 100%  : flipping stops; LOADING peels off and READY is pressed on
 *   Indeterminate        : pages keep flipping; letters press on one by one, peel off, repeat
 *
 *   const loader = DiaryLoader(document.getElementById('diary'), { onUpdate });
 *   loader.setProgress(40);
 *   loader.setIndeterminate(true);
 */
(function (global) {
  const W = 860, H = 540;                       // design size; scaled to fit the host
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const INK = '#2A1B2E';

  /* ======================= sticker artwork (all original) ======================= */
  const starPts = (cx, cy, R, r, n = 5, rot = -90) => {
    const p = []; for (let i = 0; i < n * 2; i++) { const a = (rot + i * 180 / n) * Math.PI / 180, rr = i % 2 ? r : R; p.push(`${(cx + Math.cos(a) * rr).toFixed(2)},${(cy + Math.sin(a) * rr).toFixed(2)}`); }
    return p.join(' ');
  };
  const heartD = (cx, cy, s) => `M${cx},${cy + s * 0.42} C${cx - s * 0.6},${cy} ${cx - s * 0.62},${cy - s * 0.46} ${cx - s * 0.3},${cy - s * 0.5} C${cx - s * 0.12},${cy - s * 0.52} ${cx},${cy - s * 0.38} ${cx},${cy - s * 0.26} C${cx},${cy - s * 0.38} ${cx + s * 0.12},${cy - s * 0.52} ${cx + s * 0.3},${cy - s * 0.5} C${cx + s * 0.62},${cy - s * 0.46} ${cx + s * 0.6},${cy} ${cx},${cy + s * 0.42} Z`;
  const face = (cx, cy, s, col = INK) => `<circle cx="${cx - s * 0.18}" cy="${cy - s * 0.08}" r="${s * 0.07}" fill="${col}"/><circle cx="${cx + s * 0.18}" cy="${cy - s * 0.08}" r="${s * 0.07}" fill="${col}"/><path d="M${cx - s * 0.22},${cy + s * 0.1} Q${cx},${cy + s * 0.34} ${cx + s * 0.22},${cy + s * 0.1}" fill="none" stroke="${col}" stroke-width="${s * 0.06}" stroke-linecap="round"/>`;

  let uid = 0;
  // 1) retro reward badge: coloured disc, curved slogan, a little character
  function retro({ bg, ring, text, textCol, icon }) {
    const id = 'dl-arc' + (uid++);
    const icons = {
      star: `<polygon points="${starPts(50, 60, 24, 11)}" fill="#FFF3B0" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>${face(50, 61, 20)}`,
      heart: `<path d="${heartD(50, 62, 50)}" fill="#FF4F8B" stroke="${INK}" stroke-width="2.4"/>${face(50, 58, 22, '#fff')}`,
      smile: `<circle cx="50" cy="60" r="21" fill="#FFE14D" stroke="${INK}" stroke-width="2.4"/>${face(50, 60, 32)}`,
      cherry: `<path d="M52,36 Q48,46 41,54 M52,36 Q58,46 61,54" fill="none" stroke="#2E8B3A" stroke-width="2.6" stroke-linecap="round"/><path d="M52,36 q10,-7 15,2 q-9,4 -15,-2z" fill="#4CC25A" stroke="${INK}" stroke-width="1.6"/><circle cx="41" cy="63" r="10" fill="#E8233F" stroke="${INK}" stroke-width="2.2"/><circle cx="61" cy="63" r="10" fill="#E8233F" stroke="${INK}" stroke-width="2.2"/><circle cx="38" cy="60" r="2.6" fill="#fff" opacity=".8"/><circle cx="58" cy="60" r="2.6" fill="#fff" opacity=".8"/>`,
      bolt: `<polygon points="56,36 40,64 50,64 44,84 66,52 55,52 62,36" fill="#FFE14D" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`,
      rainbow: `<path d="M26,70 A24,24 0 0 1 74,70" fill="none" stroke="#FF4F8B" stroke-width="6"/><path d="M32,70 A18,18 0 0 1 68,70" fill="none" stroke="#FFD23F" stroke-width="6"/><path d="M38,70 A12,12 0 0 1 62,70" fill="none" stroke="#7ED957" stroke-width="6"/><ellipse cx="29" cy="72" rx="10" ry="6" fill="#fff" stroke="${INK}" stroke-width="2"/><ellipse cx="71" cy="72" rx="10" ry="6" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
    };
    return `<g filter="url(#dl-die)">
      <circle cx="50" cy="50" r="46" fill="${bg}"/><circle cx="50" cy="50" r="44" fill="none" stroke="${ring}" stroke-width="3"/>
      <path id="${id}" d="M15,54 A35,35 0 0 1 85,54" fill="none"/>
      <text font-family="'Titan One','Arial Black',sans-serif" font-weight="900" font-size="14" fill="${textCol}" stroke="${INK}" stroke-width="1.2" paint-order="stroke" letter-spacing="1"><textPath href="#${id}" startOffset="50%" text-anchor="middle">${text}</textPath></text>
      ${icons[icon]}
      <ellipse cx="32" cy="24" rx="14" ry="5.5" fill="#fff" opacity=".35" transform="rotate(-32 32 24)"/>
    </g>`;
  }

  // 2) embroidered patch: satin fill (fine diagonal thread), stitched border
  function patch(kind) {
    const satin = (c) => `url(#dl-satin-${c})`;
    const stitch = (shape) => shape.replace('/>', ' fill="none" stroke="#fff" stroke-width="1.3" stroke-dasharray="2 2.4" opacity=".75"/>');
    const art = {
      star: () => { const s = `<polygon points="${starPts(50, 53, 46, 22)}"/>`;
        return s.replace('/>', ` fill="${satin('yellow')}" stroke="#D1206F" stroke-width="3" stroke-linejoin="round"/>`) + stitch(s) + `<polygon points="${starPts(50, 54, 28, 13)}" fill="${satin('pink')}"/>`; },
      disco: () => `<circle cx="50" cy="50" r="44" fill="#FFD6E8" stroke="#E0569A" stroke-width="3"/>
              <g clip-path="url(#dl-disco-clip)">${Array.from({ length: 49 }, (_, i) => { const x = i % 7, y = Math.floor(i / 7); return (x + y) % 2 ? '' : `<rect x="${7 + x * 12.3}" y="${7 + y * 12.3}" width="12.3" height="12.3" fill="${(x * y) % 3 ? '#FF4FA0' : '#FF9BCB'}"/>`; }).join('')}</g>` + stitch('<circle cx="50" cy="50" r="44"/>'),
      smiley: () => `<circle cx="50" cy="50" r="44" fill="url(#dl-glitter-pink)" stroke="#E0569A" stroke-width="3"/>${face(50, 50, 60, '#C2105F')}` + stitch('<circle cx="50" cy="50" r="44"/>'),
      bolt: () => { const s = '<polygon points="58,4 22,56 46,56 36,96 80,38 55,38 68,4"/>';
        return s.replace('/>', ` fill="${satin('sky')}" stroke="#F28B1E" stroke-width="3.5" stroke-linejoin="round"/>`) + stitch(s); },
      daisy: () => Array.from({ length: 8 }, (_, i) => `<ellipse cx="50" cy="24" rx="11" ry="22" fill="${satin(['pink', 'sky', 'orange', 'plum'][i % 4])}" stroke="#E0569A" stroke-width="2.4" transform="rotate(${i * 45} 50 50)"/>`).join('')
              + `<circle cx="50" cy="50" r="12" fill="${satin('yellow')}" stroke="#E0A21E" stroke-width="2"/>`,
      cherries: () => `<path d="M34,62 Q40,30 62,18 M66,62 Q64,36 62,18" fill="none" stroke="#2E9E48" stroke-width="5" stroke-linecap="round"/>
                 <path d="M62,18 q16,-12 26,2 q-14,8 -26,-2z" fill="${satin('green')}" stroke="#2E9E48" stroke-width="2"/>
                 <circle cx="32" cy="72" r="20" fill="#FFD6E8" stroke="#E0569A" stroke-width="3"/><circle cx="68" cy="72" r="20" fill="#FFD6E8" stroke="#E0569A" stroke-width="3"/>
                 <g clip-path="url(#dl-cherry-clip)">${Array.from({ length: 36 }, (_, i) => { const x = i % 9, y = Math.floor(i / 9); return (x + y) % 2 ? '' : `<rect x="${10 + x * 9}" y="${52 + y * 9}" width="9" height="9" fill="#FF4FA0"/>`; }).join('')}</g>`,
    };
    return `<g filter="url(#dl-die)">${art[kind]()}</g>`;
  }

  // 3) rhinestone strip on clear plastic
  function gems(pattern) {
    let x = 12, out = '';
    pattern.forEach((g, i) => {
      const id = `url(#dl-gem-${i % 6})`;
      if (g === 'h') { out += `<path d="${heartD(x + 12, 52, 26)}" fill="${id}" stroke="rgba(255,255,255,.8)" stroke-width="1"/><path d="M${x + 5},47 l7,-6 l7,6" fill="none" stroke="#fff" stroke-width="1.2" opacity=".85"/>`; x += 27; }
      else { const r = g === 'o' ? 9 : 6.5; out += `<circle cx="${x + r}" cy="50" r="${r}" fill="${id}" stroke="rgba(255,255,255,.8)" stroke-width="1"/><polygon points="${starPts(x + r, 50, r * 0.62, r * 0.28, 4, -45)}" fill="#fff" opacity=".6"/>`; x += r * 2 + 4; }
    });
    return `<rect x="2" y="28" width="${x + 4}" height="44" rx="7" fill="rgba(255,255,255,.45)" stroke="rgba(255,255,255,.95)" stroke-width="1.4"/>
            <rect x="7" y="31" width="${x - 6}" height="6" rx="3" fill="#fff" opacity=".55"/>${out}`;
  }

  // 4) holographic glitter star cluster: nested stars inside a silver glitter border
  function cluster() {
    const stars = [[18, 66, 15, '#E6B8E8', '#BFB7C4'], [44, 44, 20, '#4E9E5A', '#E4677F'], [76, 30, 22, '#F4A15A', '#4C9BE0'], [108, 44, 20, '#F2D65A', '#BCDDEA'], [132, 78, 28, '#F2A0BC', '#E2735E']];
    const border = stars.map(([x, y, r]) => `<polygon points="${starPts(x, y, r * 1.22, r * 0.66)}" fill="url(#dl-glitter-silver)" stroke="url(#dl-glitter-silver)" stroke-width="7" stroke-linejoin="round"/>`).join('');
    const body = stars.map(([x, y, r, a, b]) => `<polygon points="${starPts(x, y, r, r * 0.5)}" fill="${a}"/><polygon points="${starPts(x, y + 1, r * 0.6, r * 0.3)}" fill="${b}"/><polygon points="${starPts(x, y + 1, r * 0.26, r * 0.12)}" fill="#FFF8EC"/>`).join('');
    return `<g style="filter:drop-shadow(0 1.5px 1.5px rgba(70,20,50,.3))">${border}${body}</g>`;
  }

  function defsSVG(glitterData) {
    const satins = { yellow: ['#FFD83A', '#FFE98A'], pink: ['#FF3F9E', '#FF83C0'], sky: ['#3FB6F2', '#8BD6FF'], orange: ['#FF8A2A', '#FFB46E'], plum: ['#9B5CF2', '#C39BFF'], green: ['#3DB85A', '#7FDB8E'] };
    const sat = Object.entries(satins).map(([k, [a, b]]) => `<pattern id="dl-satin-${k}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="4" height="4" fill="${a}"/><rect width="1.6" height="4" fill="${b}"/></pattern>`).join('');
    const gemCols = ['#FF5FAE', '#7FD3FF', '#C79BFF', '#FFD24A', '#7EE08B', '#FF9C5B'];
    const gemG = gemCols.map((c, i) => `<radialGradient id="dl-gem-${i}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="${c}" stop-opacity=".95"/><stop offset=".75" stop-color="${c}"/><stop offset="1" stop-color="#3a2040" stop-opacity=".55"/></radialGradient>`).join('');
    return `<defs>
      <filter id="dl-die" x="-20%" y="-20%" width="140%" height="140%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3.4" result="d"/>
        <feFlood flood-color="#fff"/><feComposite in2="d" operator="in" result="white"/>
        <feGaussianBlur in="d" stdDeviation="0.9" result="sb"/><feOffset in="sb" dx="0.3" dy="0.9" result="so"/>
        <feFlood flood-color="rgba(60,20,40,.42)"/><feComposite in2="so" operator="in" result="shadow"/>
        <feMerge><feMergeNode in="shadow"/><feMergeNode in="white"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      ${sat}${gemG}
      <linearGradient id="dl-holo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFB3E6"/><stop offset=".35" stop-color="#B8C8FF"/><stop offset=".65" stop-color="#C8FFE8"/><stop offset="1" stop-color="#FFE7A8"/></linearGradient>
      <pattern id="dl-glitter-silver" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="#D9D6E3"/><rect width="70" height="70" fill="url(#dl-holo)" opacity=".55"/><image href="${glitterData}" width="70" height="70"/></pattern>
      <pattern id="dl-glitter-pink" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#FF8CC6"/><image href="${glitterData}" width="60" height="60"/></pattern>
      <clipPath id="dl-disco-clip"><circle cx="50" cy="50" r="42.5"/></clipPath>
      <clipPath id="dl-star" clipPathUnits="objectBoundingBox"><polygon points="${starPts(0.5, 0.53, 0.5, 0.2).split(' ').map(q=>q).join(' ')}"/></clipPath>
      <clipPath id="dl-heart" clipPathUnits="objectBoundingBox"><path d="M0.5,0.93 C0.2,0.72 0,0.53 0,0.31 C0,0.13 0.13,0.02 0.29,0.02 C0.4,0.02 0.47,0.08 0.5,0.16 C0.53,0.08 0.6,0.02 0.71,0.02 C0.87,0.02 1,0.13 1,0.31 C1,0.53 0.8,0.72 0.5,0.93 Z"/></clipPath>
      <filter id="dl-white"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/></filter>
      <clipPath id="dl-cherry-clip"><circle cx="32" cy="72" r="18.5"/><circle cx="68" cy="72" r="18.5"/></clipPath>
    </defs>`;
  }

  // centre x, centre y, width, base rotation, [kind, arg]
  const STICKERS = [
    [92, 80, 96, -10, ['retro', { bg: '#FFE14D', ring: '#F2A900', text: 'SO FETCH', textCol: '#FF3E9A', icon: 'star' }]],
    [228, 58, 70, 12, ['patch', 'star']],
    [350, 92, 86, -6, ['retro', { bg: '#FF9BCB', ring: '#E0569A', text: 'WOW!', textCol: '#FFFFFF', icon: 'heart' }]],
    [78, 432, 88, 8, ['retro', { bg: '#7ED957', ring: '#3FA33A', text: 'RAD!', textCol: '#FFE14D', icon: 'smile' }]],
    [214, 474, 64, -14, ['patch', 'disco']],
    [346, 452, 150, 6, ['gems', ['h', 'o', 'h', 'o', 'h']]],
    [160, 378, 58, 16, ['patch', 'bolt']],
    [500, 470, 72, -8, ['patch', 'cherries']],
    [616, 74, 180, -6, ['cluster']],
    [786, 86, 82, 10, ['retro', { bg: '#5BC0FF', ring: '#2C86D6', text: 'YAY!', textCol: '#FFE14D', icon: 'rainbow' }]],
    [506, 148, 60, 14, ['patch', 'smiley']],
    [786, 436, 88, -12, ['retro', { bg: '#FF6B6B', ring: '#C8323A', text: 'TOTALLY', textCol: '#FFF4D6', icon: 'cherry' }]],
    [650, 452, 70, 10, ['patch', 'daisy']],
    [792, 214, 150, 84, ['gems', ['s', 'o', 's', 'o', 's', 'o']]],
    [458, 396, 82, -4, ['retro', { bg: '#C79BFF', ring: '#8A55E0', text: 'COOL', textCol: '#FFFFFF', icon: 'bolt' }]],
  ];

  // shiny holographic foil stickers: x, y, size, rotation, shape, palette, inner shape?
  const HOLO = [
    [432, 150, 62, 14, 'star', ['#FF4FB0', '#FF9AD6', '#FFE1F2', '#E0258E'], 1],   // straddles the spine
    [40, 262, 58, -16, 'star', ['#FFC93C', '#FFE89A', '#FFF7D6', '#E09B12'], 0],   // hangs off the left edge
    [300, 372, 50, 10, 'heart', ['#3D8BFF', '#8EC9FF', '#E0F3FF', '#1F5FD6'], 0],
    [622, 362, 60, -10, 'heart', ['#8E4BFF', '#C69BFF', '#F1E6FF', '#5E24C9'], 1],
    [428, 522, 64, 6, 'heart', ['#FF4FB0', '#FF9AD6', '#FFE1F2', '#E0258E'], 1],   // over the bottom edge
    [690, 176, 42, 18, 'star', ['#5ED34A', '#B7F27E', '#EFFFD9', '#2E9E2A'], 0],
  ];

  const WORDS = {
    LOADING: [['L', 118, 'A', 82, -4], ['O', 214, 'B', 96, 3], ['A', 316, 'A', 88, -2], ['D', 420, 'B', 104, 5], ['I', 505, 'A', 92, -6], ['N', 576, 'B', 98, 2], ['G', 684, 'A', 94, -3]],
    READY: [['R', 170, 'B', 104, -4], ['E', 296, 'A', 98, 3], ['A', 420, 'B', 110, -3], ['D', 548, 'A', 100, 4], ['Y', 670, 'B', 106, -5]],
  };
  const LETTER_COLS = ['#FF3E9A', '#FFC928', '#38B6FF', '#7ED957', '#A66BFF', '#FF8A2A', '#FF5F8F'];

  // Paper: fine grain, a few long fibres and soft cloudy unevenness, tiled
  function paperURL(size = 256) {
    const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, size, size);
    const img = x.getImageData(0, 0, size, size), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const v = 255 - Math.random() * 9; d[i] = v; d[i + 1] = v - 1; d[i + 2] = v - 3; }
    x.putImageData(img, 0, 0);
    for (let i = 0; i < 26; i++) {                       // soft clouds (formation of the sheet)
      const cx = Math.random() * size, cy = Math.random() * size, r = 20 + Math.random() * 60;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, 'rgba(120,100,80,.022)'); g.addColorStop(1, 'rgba(120,100,80,0)');
      x.fillStyle = g; x.fillRect(0, 0, size, size);
    }
    x.lineCap = 'round';
    for (let i = 0; i < 90; i++) {                       // fibres
      x.strokeStyle = `rgba(110,90,80,${0.04 + Math.random() * 0.07})`; x.lineWidth = 0.4 + Math.random() * 0.5;
      const sx = Math.random() * size, sy = Math.random() * size, a = Math.random() * 6.28, l = 6 + Math.random() * 22;
      x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(sx + Math.cos(a + 0.6) * l * 0.5, sy + Math.sin(a + 0.6) * l * 0.5, sx + Math.cos(a) * l, sy + Math.sin(a) * l); x.stroke();
    }
    return c.toDataURL();
  }

  function glitterURL() {
    const c = document.createElement('canvas'); c.width = c.height = 140; const x = c.getContext('2d');
    for (let i = 0; i < 520; i++) { const r = Math.random() < 0.85 ? 0.7 : 1.4; x.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.7})`; x.beginPath(); x.arc(Math.random() * 140, Math.random() * 140, r, 0, 7); x.fill(); }
    for (let i = 0; i < 200; i++) { x.fillStyle = `hsla(${Math.random() * 360},90%,70%,${Math.random() * 0.6})`; x.fillRect(Math.random() * 140, Math.random() * 140, 1.3, 1.3); }
    return c.toDataURL();
  }

  const RECEIPT_L = `CORNER STORE #1003
123 NORTH SHORE RD
<b>10/03/2010   3:14 PM</b>

GLITTER GEL PEN      1.25
STICKER SHEET - GEMS 1.50
IRON-ON PATCHES      4.99
LIP GLOSS (PINK)     3.00
SPIRAL DIARY         4.99
--------------------------
SUBTOTAL            15.73
TAX                  2.04
TOTAL               17.77

*** CUSTOMER COPY ***
    THANK YOU, COME AGAIN`;
  const RECEIPT_R = `DEBIT PURCHASE
<b>APPROVED   00 001</b>
10/03/2010  15:14:07

PHONE CHARM       1  2.50
HAIR CLIPS (6)    1  3.25
SCENTED STICKERS  1  1.99

RETURNS ACCEPTED WITHIN
30 DAYS WITH RECEIPT.`;

  function el(tag, cls, parent, html) { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; if (parent) parent.appendChild(n); return n; }

  function DiaryLoader(host, opts = {}) {
    const reduceMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    host.classList.add('dl-host');
    const glitterData = glitterURL(), glitter = `url(${glitterData})`;
    const paper = `url(${paperURL()})`;
    host.style.setProperty('--paper-tex', paper);
    host.style.setProperty('--glitter', glitter);
    document.documentElement.style.setProperty('--glitter', glitter);
    const fit = el('div', 'dl-fit', host);
    const diary = el('div', 'dl-diary', fit);
    diary.setAttribute('role', 'img');
    diary.setAttribute('aria-label', 'An open diary covered in stickers, with letter stickers spelling the status');

    const NS = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(NS, 'svg'); defs.setAttribute('width', 0); defs.setAttribute('height', 0); defs.style.position = 'absolute';
    defs.innerHTML = defsSVG(glitterData); host.appendChild(defs);

    const left = el('div', 'dl-page dl-left', diary), right = el('div', 'dl-page dl-right', diary);
    el('pre', 'dl-receipt', left, RECEIPT_L); el('pre', 'dl-receipt dl-r2', right, RECEIPT_R);
    el('span', 'dl-doodle d1', left, 'omg!!'); el('span', 'dl-doodle d2', right, 'xoxo ♡');
    el('div', 'dl-spine', diary);
    const leaves = el('div', 'dl-leaves', diary);

    // Every sticker gets its own gloss: a soft highlight, masked to the sticker's outline, that slides toward the light.
    const stickers = STICKERS.map(([x, y, w0, rot, [kind, arg]], i) => {
      const w = w0 * (kind === 'patch' ? 1.3 : kind === 'retro' ? 1.12 : 1.05);
      const inner = kind === 'retro' ? retro(arg) : kind === 'patch' ? patch(arg) : kind === 'gems' ? gems(arg) : cluster();
      const vb = kind === 'gems' ? [0, 0, 150, 100] : kind === 'cluster' ? [-4, 0, 170, 116] : [-6, -6, 112, 112];
      const h = w * vb[3] / vb[2];
      const s = el('div', `dl-stk k-${kind}`, diary);
      s.style.cssText = `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;--rot:${rot}deg`;
      // patches are thread (matte), badges are glossy vinyl, gems and foil flash hardest
      const gloss = kind === 'patch' ? 0.28 : kind === 'retro' ? 0.6 : 0.95;
      s.innerHTML = `<svg viewBox="${vb.join(' ')}" width="100%" height="100%" overflow="visible">
        <defs><radialGradient id="dl-gl${i}" cx=".3" cy=".25" r=".55"><stop offset="0" stop-color="#fff" stop-opacity="${gloss}"/><stop offset=".45" stop-color="#fff" stop-opacity="${gloss * 0.25}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <mask id="dl-m${i}" maskUnits="userSpaceOnUse" x="${vb[0] - 20}" y="${vb[1] - 20}" width="${vb[2] + 40}" height="${vb[3] + 40}"><use href="#dl-a${i}" filter="url(#dl-white)"/></mask></defs>
        <g id="dl-a${i}">${inner}</g>
        <rect x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="url(#dl-gl${i})" mask="url(#dl-m${i})" class="gloss"/></svg>`;
      return { el: s, sign: i % 2 ? 1 : -1, grad: s.querySelector('radialGradient'), kind };
    });
    HOLO.forEach(([x, y, size, rot, shape, [a, b, c, d], inner], j) => {
      const s = el('div', `dl-stk k-holo ${shape}`, diary);
      s.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;--rot:${rot}deg;--a:${a};--b:${b};--c:${c};--d:${d};--seed:${j * 67}deg`;
      el('i', 'die', s); el('i', 'holo', s); if (inner) el('i', 'inner', s);
      stickers.push({ el: s, sign: j % 2 ? -1 : 1, kind: 'holo' });
    });

    const wordLayer = el('div', 'dl-words', diary);
    const words = {};
    for (const [w, letters] of Object.entries(WORDS)) {
      const g = el('div', 'dl-word', wordLayer); g.dataset.word = w;
      words[w] = letters.map(([ch, x, font, size, rot], i) => {
        const top = 250 - size * 0.62 + (i % 2 ? 10 : -6);
        const guide = el('span', `dl-guide f${font}`, g, ch);
        const s = el('span', `dl-ltr f${font}`, g, ch);
        for (const n of [guide, s]) n.style.cssText = `left:${x}px;top:${top}px;font-size:${size}px;--r:${rot}deg;--c:${LETTER_COLS[i % LETTER_COLS.length]}`;
        return { s, guide };
      });
    }

    el('div', 'dl-shade', diary);      // gutter + page curvature, multiplied over stickers too
    el('div', 'dl-glow', diary);       // soft light that follows the pointer

    function resize() { const k = Math.min(host.clientWidth / W, host.clientHeight / H); fit.style.transform = `scale(${k})`; }
    new ResizeObserver(resize).observe(host); resize();

    // ---- light: follows the pointer; drifts slowly on its own when the pointer is away ----
    let lightX = null, lightY = null, lastPointer = -1e9, lightQueued = false;
    function applyLight(mx, my) {
      const hr = diary.getBoundingClientRect();
      diary.style.setProperty('--px', ((mx - hr.left) / hr.width * 100).toFixed(1) + '%');
      diary.style.setProperty('--py', ((my - hr.top) / hr.height * 100).toFixed(1) + '%');
      for (const st of stickers) {
        const r = st.el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = mx - cx, dy = my - cy, dist = Math.hypot(dx, dy);
        // un-rotate the offset into the sticker's own frame so the highlight lands on the side facing the light
        const rot = (parseFloat(st.el.style.getPropertyValue('--rot')) + (parseFloat(st.el.style.getPropertyValue('--tip')) || 0)) * Math.PI / 180;
        const lx = dx * Math.cos(-rot) - dy * Math.sin(-rot), ly = dx * Math.sin(-rot) + dy * Math.cos(-rot);
        const reach = Math.max(r.width, r.height) * 1.6 + 120;
        const hx = 0.5 + Math.max(-1, Math.min(1, lx / reach)) * 0.42, hy = 0.5 + Math.max(-1, Math.min(1, ly / reach)) * 0.42;
        const near = Math.exp(-dist / 520);
        if (st.grad) {
          st.grad.setAttribute('cx', hx.toFixed(3)); st.grad.setAttribute('cy', hy.toFixed(3));
          st.el.style.setProperty('--gloss', (0.45 + 0.55 * near).toFixed(2));
        } else {
          st.el.style.setProperty('--lx', (hx * 100).toFixed(1) + '%'); st.el.style.setProperty('--ly', (hy * 100).toFixed(1) + '%');
          st.el.style.setProperty('--hue', (Math.atan2(ly, lx) * 180 / Math.PI).toFixed(1) + 'deg');   // foil colours swing with the light
          st.el.style.setProperty('--glint', (0.45 + 0.55 * near).toFixed(2));
        }
      }
    }
    function queueLight(x, y) {
      lightX = x; lightY = y;
      if (!lightQueued) { lightQueued = true; requestAnimationFrame(() => { lightQueued = false; applyLight(lightX, lightY); }); }
    }
    const lightTarget = global.document;
    lightTarget.addEventListener('pointermove', (e) => { lastPointer = performance.now(); queueLight(e.clientX, e.clientY); }, { passive: true });

    // ---- pages + tipping ----
    let tipSide = 0, flips = 0;
    function tip(side) { tipSide = side; stickers.forEach(({ el: s, sign }) => s.style.setProperty('--tip', `${side * sign * 10}deg`)); }
    function flip() {
      const leaf = el('div', 'dl-leaf', leaves);
      el('div', 'front', leaf, '<span>♡</span>'); el('div', 'back', leaf);
      leaf.style.setProperty('--dur', (reduceMotion ? 0.01 : 0.72) + 's');
      requestAnimationFrame(() => requestAnimationFrame(() => leaf.classList.add('go')));
      setTimeout(() => leaf.classList.add('done'), reduceMotion ? 20 : 760);
      setTimeout(() => leaf.remove(), reduceMotion ? 50 : 1000);
      flips++; tip(tipSide === 1 ? -1 : 1);
    }

    // ---- letters: pressed on like stickers, peeled off in reverse ----
    const placed = { LOADING: 0, READY: 0 };
    function setPlaced(w, n) {
      const arr = words[w];
      n = clamp(Math.round(n), 0, arr.length);
      if (n === placed[w]) return;
      const prev = placed[w];
      arr.forEach(({ s }, i) => {
        const on = i < n, was = i < prev;
        if (on && !was) { s.classList.remove('off'); s.style.transitionDelay = '0ms'; void s.offsetWidth; s.classList.add('on'); }
        if (!on && was) { s.classList.remove('on'); s.style.transitionDelay = ((prev - 1 - i) * 45) + 'ms'; s.classList.add('off'); }
      });
      placed[w] = n;
    }
    function showGuides(w) { Object.entries(words).forEach(([k, arr]) => arr.forEach(({ guide }) => guide.classList.toggle('show', k === w))); }

    let shown = 0, target = 0, indet = false, last = 0, nextFlip = 0, state = 'empty', word = 'LOADING', loopT = 0, readyTimer = 0;
    function tick(now) {
      const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      if (!indet) {
        const gap = target - shown;
        if (Math.abs(gap) < 0.02 || reduceMotion) shown = target;
        else shown += Math.sign(gap) * Math.min(Math.abs(gap), Math.max(gap > 0 ? 6 : 30, Math.min(gap > 0 ? 45 : 140, Math.abs(gap) * 2.8)) * dt);
        state = shown <= 0.001 ? 'empty' : shown >= 99.999 ? 'complete' : 'progress';
      }
      const working = indet || state === 'progress';
      if (working && now >= nextFlip) { flip(); nextFlip = now + (indet ? 620 : 760); }
      if (!working && tipSide !== 0) tip(0);

      if (indet) {                                           // press on one by one, hold, peel, repeat
        loopT += reduceMotion ? 0 : dt;
        const step = 0.34, hold = 1.1, gap = 0.55, cycle = 7 * step + hold + gap, t = loopT % cycle;
        if (word !== 'LOADING') { clearTimeout(readyTimer); setPlaced('READY', 0); word = 'LOADING'; showGuides('LOADING'); }
        setPlaced('LOADING', t < 7 * step ? Math.floor(t / step) + 1 : t < 7 * step + hold ? 7 : 0);
      } else if (state === 'complete') {
        if (word !== 'READY') {
          setPlaced('LOADING', 7); word = 'READY';
          readyTimer = setTimeout(() => { if (word !== 'READY') return; setPlaced('LOADING', 0); showGuides('READY'); setTimeout(() => word === 'READY' && setPlaced('READY', 5), 360); }, 260);
        }
      } else {
        if (word !== 'LOADING') { clearTimeout(readyTimer); setPlaced('READY', 0); word = 'LOADING'; showGuides('LOADING'); }
        setPlaced('LOADING', Math.floor(shown / 100 * 8 + 1e-6));   // letter i goes down at (i+1)/8, all seven before 100%
      }

      if (now - lastPointer > 2500) {                        // idle: a slow lamp drifting over the desk
        const hr = diary.getBoundingClientRect(), a = reduceMotion ? 2.3 : now / 5200;
        if (!reduceMotion || lightX === null) queueLight(hr.left + hr.width * (0.5 + 0.42 * Math.cos(a)), hr.top + hr.height * (0.35 + 0.3 * Math.sin(a * 1.3)));
      } else if (working && lightX !== null) queueLight(lightX, lightY);

      host.dataset.state = indet ? 'indeterminate' : state;
      opts.onUpdate?.(indet ? { percent: null, state: 'indeterminate', flips } : { percent: shown, state, flips });
      requestAnimationFrame(tick);
    }
    showGuides('LOADING');
    requestAnimationFrame(tick);

    return {
      setProgress(v) { target = clamp(Number(v) || 0, 0, 100); },
      setIndeterminate(on) { on = !!on; if (on && !indet) loopT = 0; indet = on; nextFlip = 0; },
      get progress() { return shown; },
      get indeterminate() { return indet; },
    };
  }
  global.DiaryLoader = DiaryLoader;
})(window);
