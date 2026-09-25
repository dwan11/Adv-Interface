(function () {
  const $ = (id) => document.getElementById(id);
  const readout = $('readout'), status = $('status'), pct = $('pct'), hearts = $('hearts'), scrub = $('scrub');
  const chips = [...document.querySelectorAll('.states button')];
  const mIndet = $('mIndet'), mDet = $('mDet');
  const cells = Array.from({ length: 10 }, (_, k) => { const i = document.createElement('i'); i.style.setProperty('--k', k); hearts.appendChild(i); return i; });

  let lastKey = '';
  const loader = DiaryLoader($('diary'), {
    onUpdate: ({ percent, state }) => {
      const p = percent === null ? null : Math.round(percent);
      const key = state + p; if (key === lastKey) return; lastKey = key;
      readout.dataset.state = state;
      status.textContent = state === 'complete' ? 'READY' : 'LOADING';
      if (p === null) {
        pct.textContent = '…';
        readout.removeAttribute('aria-valuenow'); readout.setAttribute('aria-valuetext', 'Loading, progress unknown');
        cells.forEach((c) => c.classList.remove('on'));
        return;
      }
      readout.removeAttribute('aria-valuetext'); readout.setAttribute('aria-valuenow', p);
      pct.textContent = p + '%';
      cells.forEach((c, i) => c.classList.toggle('on', i < Math.round(percent / 10)));
    },
  });

  let timer = null;
  function setMode(indet) {
    loader.setIndeterminate(indet);
    mIndet.setAttribute('aria-checked', String(indet)); mDet.setAttribute('aria-checked', String(!indet));
    hearts.classList.toggle('indet', indet);
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

  go(50, false);   // open mid-flip so the motion is visible at a glance
})();
