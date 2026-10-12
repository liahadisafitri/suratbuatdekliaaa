(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const coarse = matchMedia('(pointer: coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- Judul muncul pelan (sekali) ---------- */
  function split(el, startDelay = 0) {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    let i = 0;
    text.split(' ').forEach((word, wi, arr) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach((ch) => {
        const c = document.createElement('span');
        c.className = 'c';
        c.textContent = ch;
        c.style.animationDelay = startDelay + i * 22 + 'ms';
        i++;
        w.appendChild(c);
      });
      el.appendChild(w);
      if (wi < arr.length - 1) el.appendChild(document.createTextNode(' '));
    });
  }
  document.querySelectorAll('.split').forEach((el) => split(el, 150));

  /* ---------- Latar samar: bintang & hati kecil ---------- */
  const stars = $('stars');
  for (let i = 0; i < (coarse ? 10 : 18); i++) {
    const s = document.createElement('span');
    s.textContent = i % 3 ? '✦' : '✧';
    s.style.left = rand(0, 100) + '%';
    s.style.top = rand(0, 100) + '%';
    s.style.fontSize = rand(8, 14) + 'px';
    s.style.animationDelay = rand(0, 7) + 's';
    s.style.animationDuration = rand(6, 10) + 's';
    stars.appendChild(s);
  }
  const bg = $('bg');
  const icons = ['💗', '💖', '🌸', '💕', '🤍'];
  for (let i = 0; i < (coarse ? 7 : 12); i++) {
    const s = document.createElement('span');
    s.textContent = icons[i % icons.length];
    s.style.left = rand(0, 100) + '%';
    s.style.fontSize = rand(12, 22) + 'px';
    s.style.animationDuration = rand(22, 34) + 's';
    s.style.animationDelay = -rand(0, 30) + 's';
    bg.appendChild(s);
  }

  /* ---------- Toast ---------- */
  const toastEl = $('toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 4200);
  }

  /* ---------- Efek partikel: hanya di momen-momen khusus ---------- */
  const cv = $('fx');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, P = [], raf = null;
  const MAX = coarse ? 110 : 180;
  const PAL = ['#ff5c8a', '#ff9ebb', '#ffd6e4', '#e63958', '#ffffff', '#ffc2d6'];
  const pick = () => PAL[(Math.random() * PAL.length) | 0];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  function heartPath(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s * 0.95, -s * 0.2, -s * 0.5, -s * 0.95, 0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.5, -s * 0.95, s * 0.95, -s * 0.2, 0, s * 0.35);
    ctx.closePath();
  }
  function add(p) {
    if (P.length >= MAX) return;
    p.life = 0;
    P.push(p);
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    P = P.filter((p) => p.life < p.max && p.y < H + 40);
    for (const p of P) {
      p.life++;
      p.vy += p.g; p.vx *= p.drag; p.vy *= p.drag;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      const t = p.life / p.max;
      ctx.save();
      ctx.globalAlpha = t > 0.55 ? Math.max(0, 1 - (t - 0.55) / 0.45) : 1;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'heart') { heartPath(p.size); ctx.fill(); }
      else { ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
      ctx.restore();
    }
    if (P.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, W, H); }
  }
  function confettiBlast() {
    if (reduce) return;
    const n = coarse ? 50 : 80;
    for (let i = 0; i < n; i++) {
      const heart = Math.random() < 0.5;
      add({ x: W / 2, y: H * 0.42, vx: rand(-6, 6), vy: rand(-12, -3), g: 0.28, drag: 0.992,
        size: heart ? rand(7, 12) : rand(6, 11), rot: rand(0, 6), vr: rand(-0.25, 0.25),
        color: pick(), shape: heart ? 'heart' : 'rect', max: rand(90, 140) });
    }
  }

  /* ---------- Musik: Semenjak Ada Dirimu (YouTube resmi) ---------- */
  const YT_ID = 'ZAybxhFJBSg'; // Yovie Widianto, HIVI! - Semenjak Ada Dirimu (Official Lyric Video)
  const bgm = $('bgm');
  const musicBtn = $('musicBtn');
  const vidBtn = $('vidBtn');
  const ytPanel = $('ytPanel');
  let yt = null, ytReady = false, ytFailed = false, wantPlay = false, isPlaying = false, fadeTimer;

  function setPlaying(on) {
    isPlaying = on;
    musicBtn.textContent = on ? '⏸' : '▶';
    musicBtn.setAttribute('aria-label', on ? 'Jeda musik' : 'Putar musik');
  }
  function fadeIn(setVol) {
    clearInterval(fadeTimer);
    let v = 0;
    setVol(0);
    fadeTimer = setInterval(() => {
      v = Math.min(100, v + 5);
      setVol(v);
      if (v >= 100) clearInterval(fadeTimer);
    }, 120);
  }

  function initYT() {
    const vars = { playsinline: 1, rel: 0, modestbranding: 1, loop: 1, playlist: YT_ID, controls: 1, fs: 0 };
    if (location.protocol.indexOf('http') === 0) vars.origin = location.origin;
    try {
      yt = new YT.Player('ytPlayer', {
        width: '100%', height: '100%', videoId: YT_ID, playerVars: vars,
        events: {
          onReady: () => { ytReady = true; if (wantPlay) { wantPlay = false; startMusic(true); } },
          onStateChange: (e) => {
            if (e.data === 1) setPlaying(true);
            else if (e.data === 2) setPlaying(false);
          },
          onError: () => {
            ytFailed = true; setPlaying(false);
            toast(location.protocol === 'file:'
              ? 'Lagu YouTube hanya bisa jalan lewat link website (misalnya GitHub Pages), bukan dari file di komputer 🎵'
              : 'Lagu tidak bisa dimuat sekarang. Coba muat ulang halaman 🎵');
            if (wantPlay) { wantPlay = false; startLocal(true); }
          }
        }
      });
    } catch (err) { ytFailed = true; }
  }
  function loadYT() {
    if (window.YT && YT.Player) { initYT(); return; }
    window.onYouTubeIframeAPIReady = initYT;
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => { ytFailed = true; };
    document.head.appendChild(s);
  }
  loadYT();

  function startLocal(silent) {
    bgm.load();
    const p = bgm.play();
    if (p && p.then) {
      p.then(() => { setPlaying(true); fadeIn((v) => { bgm.volume = v / 100; }); })
       .catch(() => { setPlaying(false); if (!silent) toast('Lagu belum bisa diputar 🎵'); });
    }
  }
  function startMusic(silent) {
    if (ytReady && !ytFailed) {
      yt.setVolume(0);
      yt.playVideo();
      fadeIn((v) => yt.setVolume(v));
    } else if (!ytFailed) {
      wantPlay = true; // API belum siap, mulai begitu siap
      if (!silent) toast('Lagu sedang dimuat… 🎵');
    } else {
      startLocal(silent);
    }
  }
  function stopMusic() {
    wantPlay = false;
    if (ytReady && !ytFailed) yt.pauseVideo();
    bgm.pause();
    setPlaying(false);
  }
  musicBtn.addEventListener('click', () => { if (isPlaying) stopMusic(); else startMusic(false); });
  vidBtn.addEventListener('click', () => {
    const show = ytPanel.classList.toggle('off') === false;
    vidBtn.setAttribute('aria-pressed', String(show));
  });
  bgm.addEventListener('pause', () => { if (ytFailed) setPlaying(false); });

  /* ---------- Tombol "Nggak" kabur ---------- */
  const noBtn = $('noBtn');
  const yesBtn = $('yesBtn');
  const hint = $('hint');
  const hints = [
    'Eh kok kabur sih tombolnya? 😝',
    'Ayoo coba lagi, tangkep kalau bisa hehe 🏃‍♀️',
    'Tombolnya malu-malu, sayang 🙈',
    'Udah deh, pencet yang satunya aja yaa 🥺❤️',
    'Nggak bisa dipencet looh, nyerah aja 😚'
  ];
  let escapes = 0;

  function runAway(e) {
    if (e && e.cancelable) e.preventDefault();
    const w = noBtn.offsetWidth, h = noBtn.offsetHeight, pad = 12;
    const top = 76; // ruang untuk pemutar musik
    const maxX = W - w - pad, maxY = H - h - pad;
    const yr = yesBtn.getBoundingClientRect();
    let x, y, tries = 0;
    do {
      x = rand(pad, Math.max(pad, maxX));
      y = rand(top, Math.max(top, maxY));
      tries++;
    } while (tries < 20 &&
      x < yr.right + 12 && x + w > yr.left - 12 && y < yr.bottom + 12 && y + h > yr.top - 12);
    noBtn.classList.add('run');
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    hint.textContent = hints[Math.min(escapes, hints.length - 1)];
    escapes++;
    yesBtn.style.transform = 'scale(' + Math.min(1 + escapes * 0.04, 1.15) + ')';
  }
  noBtn.addEventListener('mouseenter', runAway);
  noBtn.addEventListener('touchstart', runAway, { passive: false });
  noBtn.addEventListener('click', runAway);

  /* ---------- Jawaban "Sayang Bangettt!" ---------- */
  yesBtn.addEventListener('click', () => {
    noBtn.classList.add('hidden');
    $('intro').classList.add('hidden');
    $('yes').classList.remove('hidden');
    split($('yesTitle'), 150);
    confettiBlast();
    setTimeout(confettiBlast, 500);
    if (!isPlaying) startMusic(true); // sudah ada interaksi pengguna, jadi boleh mulai
  });

  /* ---------- Surat ---------- */
  // Isi surat PERSIS seperti permintaan.
  const letter = [
    { cls: 'to', text: 'To: My Favorite Person 💌' },
    { text: 'Hai, sayangkuuu. ❤️' },
    { text: 'Kamu tahu nggak? Dari sekian banyak orang di dunia ini, aku bersyukur banget bisa mengenal kamu. Hal-hal sederhana tentang kamu selalu punya cara sendiri untuk bikin aku senyum dan jatuh cinta berkali-kali.' },
    { text: 'Aku suka cara kamu tertawa, cara kamu bercerita, bahkan hal-hal kecil yang mungkin nggak kamu sadari. Buat aku, kamu nggak perlu jadi sempurna untuk bisa disayang. Jadi diri kamu sendiri aja, ya, sayang. 🥹💗' },
    { text: 'Sayangkuuu mass minta tolong jangan tinggalin mamas, mass mauu selamanyaa sama adee Liaa, dee mass minta tolongg dee jangan jauh jauh dari mass yaa dek liaa kuu sayangkuuu' },
    { text: 'Adeee jangan nakal nakal yaa. Kalo nakal di cubit tak ciumm nantii hehehe 😚💋' },
    {
      text: 'Kalau boleh, sekarang aku mau peluk kamu lama-lama sambil bilang, “Makasih ya, sudah hadir dan menjadi seseorang yang begitu istimewa di hidupku.”',
      html: 'Kalau boleh, sekarang aku mau peluk kamu lama-lama sambil bilang, <strong>“Makasih ya, sudah hadir dan menjadi seseorang yang begitu istimewa di hidupku.”</strong>'
    },
    { text: 'I love you, Dek Liaaa ku sayanggg. Muachhh! 😚💋' },
    { cls: 'sign', text: 'Sinii peyukkk dulu, nggak boleh nolak yaaa! 🤏🏻❤️' }
  ];

  const overlay = $('overlay');
  const envWrap = $('envWrap');
  const envelope = $('envelope');
  const letterEl = $('letter');
  const body = $('letterBody');
  let typingToken = 0;

  function buildStatic() {
    body.innerHTML = '';
    letter.forEach((l) => {
      const p = document.createElement('p');
      if (l.cls) p.className = l.cls;
      if (l.html) p.innerHTML = l.html; else p.textContent = l.text;
      body.appendChild(p);
    });
  }

  async function typeLetter() {
    const token = ++typingToken;
    body.innerHTML = '';
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const l of letter) {
      if (token !== typingToken) return;
      const p = document.createElement('p');
      if (l.cls) p.className = l.cls;
      p.classList.add('cursor');
      body.appendChild(p);
      const chars = Array.from(l.text);
      for (let i = 0; i < chars.length; i++) {
        if (token !== typingToken) return;
        p.textContent += chars[i];
        if (i % 14 === 0) body.scrollTop = body.scrollHeight;
        await sleep(chars[i] === '.' || chars[i] === ',' ? 70 : 22);
      }
      p.classList.remove('cursor');
      if (l.html) p.innerHTML = l.html;
      body.scrollTop = body.scrollHeight;
      await sleep(300);
    }
  }

  function openLetterFlow() {
    overlay.classList.remove('hidden');
    letterEl.classList.add('hidden');
    envWrap.classList.remove('hidden');
    envelope.classList.remove('open');
  }
  function revealLetter() {
    if (envelope.classList.contains('open')) return;
    envelope.classList.add('open');
    setTimeout(() => {
      envWrap.classList.add('hidden');
      letterEl.classList.remove('hidden');
      typeLetter(); // tanpa efek di atas teks, supaya mudah dibaca
    }, 1500);
  }
  function closeLetter() {
    typingToken++;
    overlay.classList.add('hidden');
    envelope.classList.remove('open');
    confettiBlast();
  }

  $('letterBtn').addEventListener('click', openLetterFlow);
  envelope.addEventListener('click', revealLetter);
  $('closeBtn').addEventListener('click', closeLetter);
  $('skipBtn').addEventListener('click', () => { typingToken++; buildStatic(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLetter(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeLetter();
  });
})();
