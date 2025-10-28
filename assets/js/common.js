/* Easy Education – common.js
   - Dark Mode Toggle (speichert Zustand)
   - Nav-Item automatisch als "active" markieren
   - Back-to-Top Button
   - Lightbox (Impressionen)
   - FAQ Akkordeon
   - Kontaktformular (Mini-Validierung, Demo)
*/

/* ---------- Dark Mode ---------- */
(() => {
  const KEY = 'dl-dark';
  const root = document.documentElement;
  const btns = document.querySelectorAll('[data-toggle-theme]');

  const setTheme = (on) => {
    root.classList.toggle('dark', on);
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
    // Icon wechseln: hell -> 🌙, dunkel -> ☀️
    btns.forEach(b => b.textContent = on ? '☀️' : '🌙');
  };

  // Initial aus Storage
  const initial = (localStorage.getItem(KEY) === '1');
  setTheme(initial);

  // Klick-Handling
  btns.forEach(b => {
    b.type = 'button';
    b.addEventListener('click', () => setTheme(!root.classList.contains('dark')));
  });
})();

/* ---------- Nav aktiv markieren ---------- */
(() => {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = (a.getAttribute('href')||'').toLowerCase();
    if(href === file){ a.setAttribute('aria-current','page'); }
  });
})();

/* ---------- Back to top ---------- */
(() => {
  const btn = document.getElementById('toTop');
  if(!btn) return;
  const onScroll = () => { btn.style.display = window.scrollY > 300 ? 'inline-flex' : 'none'; };
  window.addEventListener('scroll', onScroll);
  onScroll();
  btn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
})();

/* ---------- Lightbox (Impressionen) ---------- */
(() => {
  const box = document.querySelector('.lightbox'); if(!box) return;
  const view = box.querySelector('img');
  document.querySelectorAll('.gallery img').forEach(img=>{
    // Performance
    img.loading = 'lazy';
    // Optional: große Version aus data-full laden
    img.addEventListener('click', ()=>{
      view.src = img.dataset.full || img.src;
      box.classList.add('open');
    });
  });
  box.addEventListener('click', ()=> box.classList.remove('open'));
})();

/* ---------- FAQ Akkordeon ---------- */
(() => {
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      btn.classList.toggle('open');
      const a = btn.nextElementSibling;
      a.style.maxHeight = a.style.maxHeight ? null : a.scrollHeight + 'px';
    });
  });
})();

/* ---------- Kontaktformular (Demo-Validierung) ---------- */
(() => {
  const form = document.getElementById('contact-form'); if(!form) return;
  const fb = document.getElementById('cf-feedback');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (document.getElementById('cf-name') || {}).value?.trim();
    const email= (document.getElementById('cf-email')|| {}).value?.trim();
    const msg  = (document.getElementById('cf-msg')  || {}).value?.trim();
    if(!name || !email || !msg){ fb.textContent = "Bitte alle Felder ausfüllen."; return; }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ fb.textContent = "Bitte gültige E-Mail eingeben."; return; }
    fb.textContent = "Danke! Deine Nachricht wurde gesendet (Demo).";
    form.reset();b
  });
})();


// FAQ Toggle (mehrere gleichzeitig erlaubt)
(function(){
  const items = document.querySelectorAll('.faq-item');
  items.forEach(it=>{
    const btn = it.querySelector('.faq-question');
    const panel = it.querySelector('.faq-answer');
    if(!btn || !panel) return;

    // ARIA initialisieren
    btn.setAttribute('role','button');
    btn.setAttribute('aria-expanded','false');

    btn.addEventListener('click', ()=>{
      const open = it.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();

btn.addEventListener('click', ()=>{
  const willOpen = !it.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(o=>{
    o.classList.remove('open');
    const b = o.querySelector('.faq-question');
    if(b) b.setAttribute('aria-expanded','false');
  });
  it.classList.toggle('open', willOpen);
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
});


<script src="assets/js/common.js"></script>

window.API_BASE = 'http://127.0.0.1:80';
window.apiGet = (p) => fetch(`${API_BASE}${p}`).then(r => r.json());
