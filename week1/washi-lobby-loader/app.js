(function () {
  const $ = (id) => document.getElementById(id);
  const svg = document.querySelector('svg.lobby');
  const readout = $('readout'), pct = $('pct'), stage = $('stage'), fill = $('fill'), dot = $('dot'), scrub = $('scrub');
  const ticks = [...document.querySelectorAll('.tick')];
  const chips = [...document.querySelectorAll('.states button')];
  const mIndet = $('mIndet'), mDet = $('mDet'), meter = document.querySelector('.meter');
  let timer = null;

  const loader = LobbyLoader(svg, {
    onUpdate: ({ percent, state, stage: name }) => {
      if (percent === null) {                      // indeterminate: light passes, no number
        pct.textContent = '—'; stage.textContent = name; readout.dataset.state = state;
        readout.removeAttribute('aria-valuenow'); readout.setAttribute('aria-valuetext', 'Loading, progress unknown');
        ticks.forEach((t) => t.classList.remove('on'));
        return;
      }
      readout.removeAttribute('aria-valuetext');
      pct.textContent = Math.round(percent);
      stage.textContent = name;
      fill.style.width = dot.style.left = percent + '%';
      readout.dataset.state = state;
      readout.setAttribute('aria-valuenow', Math.round(percent));
      ticks.forEach((t) => t.classList.toggle('on', percent >= +t.dataset.at));
    },
  });

  function setMode(indet) {
    loader.setIndeterminate(indet);
    mIndet.setAttribute('aria-checked', String(indet)); mDet.setAttribute('aria-checked', String(!indet));
    meter.classList.toggle('indet', indet);
    if (indet) chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  }
  mIndet.addEventListener('click', () => { stop(); setMode(true); });
  mDet.addEventListener('click', () => { stop(); go(+scrub.value); });

  function go(p, fromUser = true) {
    if (fromUser) stop();
    setMode(false);
    scrub.value = p;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(+c.dataset.p === +p)));
    loader.setProgress(p);
  }
  chips.forEach((c) => c.addEventListener('click', () => go(+c.dataset.p)));
  scrub.addEventListener('input', () => go(+scrub.value));
  $('reset').addEventListener('click', () => go(0));

  function stop() { clearTimeout(timer); timer = null; $('simulate').disabled = false; }
  $('simulate').addEventListener('click', () => {
    stop(); go(0, false); $('simulate').disabled = true;
    setMode(true);                              // reservation lookup: duration unknown
    let p = 0, paused = false;
    const step = () => {
      p = Math.min(100, p + 1 + Math.random() * 5);
      go(Math.round(p), false);
      if (p >= 100) { $('simulate').disabled = false; timer = null; return; }
      timer = setTimeout(step, !paused && p > 40 ? (paused = true, 1100) : 150 + Math.random() * 240);
    };
    timer = setTimeout(() => { go(0, false); step(); }, 3400);
  });

  go(55, false);   // open mid-paint so the effect is visible at a glance
})();
