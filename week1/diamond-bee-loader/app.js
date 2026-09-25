(function () {
  const $ = (id) => document.getElementById(id);
  const readout = $('readout'), pct = $('pct'), label = $('stateLabel'), note = $('note'), scrub = $('scrub'), comb = $('comb');
  const chips = [...document.querySelectorAll('.states button')];
  const mIndet = $('mIndet'), mDet = $('mDet');
  const COPY = {
    empty: ['At rest', 'Wings folded, on its cushion'],
    progress: ['In flight', 'Climbing as the work goes on'],
    complete: ['Landed', 'Home, wings flickering'],
    indeterminate: ['Waggle dance', 'Progress unknown, so it circles'],
  };
  // honeycomb: 24 cells, one per ~4%
  const cells = Array.from({ length: 24 }, (_, i) => {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 17 19'); s.style.setProperty('--i', i);
    s.innerHTML = '<polygon points="8.5,1 15.8,5.2 15.8,13.8 8.5,18 1.2,13.8 1.2,5.2"/>';
    comb.appendChild(s); return s;
  });

  let loader;
  try {
    if (!window.THREE) throw new Error('three.js did not load');
    loader = BeeLoader($('stage'), { onUpdate });
  } catch (e) {
    $('fallback').hidden = false;
    loader = { setProgress() {}, setIndeterminate() {} };
  }

  let lastKey = '';
  function onUpdate({ percent, state }) {
    const p = percent === null ? null : Math.round(percent);
    const key = state + '|' + p;
    if (key === lastKey) return; lastKey = key;
    readout.dataset.state = state;
    [label.textContent, note.textContent] = COPY[state];
    if (p === null) {
      pct.textContent = '—';
      readout.removeAttribute('aria-valuenow'); readout.setAttribute('aria-valuetext', 'Loading, progress unknown');
      cells.forEach((c) => c.classList.remove('on'));
      return;
    }
    readout.removeAttribute('aria-valuetext');
    pct.textContent = p; readout.setAttribute('aria-valuenow', p);
    const n = Math.round(percent / 100 * 24);
    cells.forEach((c, i) => c.classList.toggle('on', i < n));
  }

  let timer = null;
  function setMode(indet) {
    loader.setIndeterminate(indet);
    mIndet.setAttribute('aria-checked', String(indet)); mDet.setAttribute('aria-checked', String(!indet));
    comb.classList.toggle('indet', indet);
    if (indet) chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  }
  function go(p, fromUser = true) {
    if (fromUser) stop();
    setMode(false);
    scrub.value = p;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(+c.dataset.p === +p)));
    loader.setProgress(p);
  }
  mIndet.addEventListener('click', () => { stop(); setMode(true); });
  mDet.addEventListener('click', () => { stop(); go(+scrub.value); });
  chips.forEach((c) => c.addEventListener('click', () => go(+c.dataset.p)));
  scrub.addEventListener('input', () => go(+scrub.value));

  function stop() { clearTimeout(timer); timer = null; }

  go(50, false);   // open in flight so the motion is visible at a glance
})();
