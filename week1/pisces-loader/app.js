(function () {
  const $ = (id) => document.getElementById(id);
  const readout = $('readout'), pct = $('pct'), now = $('now'), label = $('stateLabel'),
        fill = $('fill'), track = $('track'), scrub = $('scrub');
  const LABELS = { empty: 'Unlinked', progress: 'Linking', complete: 'Joined', indeterminate: 'Seeking' };
  const mIndet = $('mIndet'), mDet = $('mDet');
  const chips = [...document.querySelectorAll('.states button')];
  let marks = [], timer = null;

  const loader = PiscesLoader($('sky'), {
    onUpdate: ({ percent, state, from, to, litCount }) => {
      if (percent === null) {                      // indeterminate: no number, just the comet
        pct.textContent = '—'; label.textContent = LABELS[state]; readout.dataset.state = state;
        readout.removeAttribute('aria-valuenow'); readout.setAttribute('aria-valuetext', 'Loading, progress unknown');
        marks.forEach((m) => m.classList.remove('on'));
        now.innerHTML = from ? `Tracing <b>${from}</b> → <b>${to}</b>` : 'Tracing the two fishes…';
        return;
      }
      readout.removeAttribute('aria-valuetext');
      const p = Math.round(percent);
      pct.textContent = p;
      fill.style.width = percent + '%';
      readout.dataset.state = state;
      readout.setAttribute('aria-valuenow', p);
      label.textContent = LABELS[state];
      marks.forEach((m) => m.classList.toggle('on', percent > 0 && percent + 1e-6 >= +m.dataset.at));
      now.innerHTML = state === 'empty' ? '16 stars waiting'
        : state === 'complete' ? 'All 16 stars joined'
        : from ? `Linking <b>${from}</b> → <b>${to}</b> · ${litCount}/16` : `${litCount}/16 stars linked`;
    },
  });

  // One diamond notch on the track for each star, placed where the line reaches it.
  marks = loader.starMarks.map((at) => {
    const m = document.createElement('span');
    m.className = 'mark'; m.dataset.at = at; m.style.left = at + '%';
    track.appendChild(m);
    return m;
  });

  function setMode(indet) {
    loader.setIndeterminate(indet);
    mIndet.setAttribute('aria-checked', String(indet)); mDet.setAttribute('aria-checked', String(!indet));
    track.classList.toggle('indet', indet);
    if (indet) chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
  }
  mIndet.addEventListener('click', () => { stopSim(); setMode(true); });
  mDet.addEventListener('click', () => { stopSim(); go(+scrub.value); });

  function go(p, fromUser = true) {
    if (fromUser) stopSim();
    setMode(false);
    scrub.value = p;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(+c.dataset.p === +p)));
    loader.setProgress(p);
  }
  chips.forEach((c) => c.addEventListener('click', () => go(+c.dataset.p)));
  scrub.addEventListener('input', () => go(+scrub.value));
  function stopSim() { clearTimeout(timer); timer = null; }

  // Open in a working state: show the progress state on load.
  go(45, false);
})();
