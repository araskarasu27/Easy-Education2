/* Easy Education– app.js
   Kurse: Liste, Filter, Details, Merkliste, Buchen (Overlay)
   Erwartete DOM-IDs (in kurse.html vorhanden):
   - Filter: #q #cat #campus #mode #sort
   - Liste: #course-list
   - Details: #detail-box .detail-close #detail-title #detail-desc #detail-meta #detail-book #detail-save
   - Buchung: #book-box #book-form #book-close #book-cancel
               #book-course-line #bk-course-id #bk-campus #bk-start
   - Optional: .toast
*/

const DL = {
  state:{
    wishlist: JSON.parse(localStorage.getItem('dl-wishlist') || '[]'),
    courses:[
      {id:1,title:"Webentwicklung Bootcamp",cat:"Informatik",mode:"Hybrid",duration:12,price:1800,
       desc:"Intensives Coding Bootcamp: HTML, CSS, JavaScript, Git und Deployment. Ideal für Quereinsteiger.",
       campus:"Zürich",start:"2025-10-20"},
      {id:2,title:"Deutsch Intensiv A1–C1",cat:"Sprachen",mode:"Präsenz",duration:20,price:1200,
       desc:"Sprachkurs mit Zertifikatsvorbereitung (Goethe/ÖSD). 20 Wochen intensives Training.",
       campus:"Bern",start:"2025-11-03"},
      {id:3,title:"Projektmanagement IPMA D",cat:"Management",mode:"Präsenz",duration:10,price:1600,
       desc:"Grundlagen moderner Projektführung, Methoden, Tools & Soft Skills. Vorbereitung auf IPMA D.",
       campus:"Luzern",start:"2025-11-05"},
      {id:4,title:"KV EFZ Erwachsene",cat:"Kaufmännisch",mode:"Präsenz",duration:18,price:2100,
       desc:"Berufsbegleitend zum KV-Abschluss für Erwachsene. Anerkanntes EFZ, praxisnah und flexibel.",
       campus:"Zürich",start:"2025-09-29"},
      {id:5,title:"Englisch Business B2",cat:"Sprachen",mode:"Online",duration:12,price:950,
       desc:"Berufliches Englisch mit Fokus auf Präsentationen, Meetings & Verhandlungen.",
       campus:"St. Gallen",start:"2025-10-15"},
      {id:6,title:"Data Science Basics",cat:"Informatik",mode:"Hybrid",duration:14,price:2200,
       desc:"Einführung in Python, Pandas, NumPy & Machine Learning. Projekte mit echten Datensätzen.",
       campus:"Bern",start:"2025-11-10"},
      {id:7,title:"Fachausweis HR",cat:"Management",mode:"Hybrid",duration:24,price:3500,
       desc:"Ausbildung zur HR-Fachperson mit eidg. Fachausweis. Schwerpunkte Personalführung & Arbeitsrecht.",
       campus:"Zürich",start:"2026-01-20"},
      {id:8,title:"Gesundheitscoach Ausbildung",cat:"Gesundheit",mode:"Präsenz",duration:16,price:2800,
       desc:"Ganzheitliche Ausbildung: Ernährung, Bewegung, Stressmanagement & Prävention.",
       campus:"Luzern",start:"2025-12-01"}
    ]
  },
  CHF(n){ return new Intl.NumberFormat('de-CH',{style:'currency',currency:'CHF'}).format(n); },
  save(){ try{ localStorage.setItem('dl-wishlist', JSON.stringify(DL.state.wishlist)); }catch{} }
};

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const fmtDate = (iso) => new Date(iso).toLocaleDateString('de-CH');
function toast(msg){
  let t = $('.toast');
  if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),1500);
}

/* ---------- Elements ---------- */
const list   = $('#course-list');
const q      = $('#q');
const cat    = $('#cat');
const campus = $('#campus');
const mode   = $('#mode');
const sort   = $('#sort');

/* Details-Overlay */
const detailBox = $('#detail-box');
const dClose = detailBox?.querySelector('.detail-close');
const dTitle = $('#detail-title');
const dDesc  = $('#detail-desc');
const dMeta  = $('#detail-meta');
const dBook  = $('#detail-book');
const dSave  = $('#detail-save');

/* Buchungs-Overlay */
const bookBox   = $('#book-box');
const bookForm  = $('#book-form');
const bookClose = $('#book-close');
const bookCancel= $('#book-cancel');
const bkLine    = $('#book-course-line');
const bkCourseId= $('#bk-course-id');
const bkCampus  = $('#bk-campus');
const bkStart   = $('#bk-start');

let currentCourse = null;

/* ---------- Render Kursliste ---------- */
function render(){
  if(!list) return;
  const term = (q?.value || '').toLowerCase();
  const fCat = cat?.value || '';
  const fCap = campus?.value || '';
  const fMod = mode?.value || '';

  let items = DL.state.courses.filter(c=>{
    const hay = (c.title + c.desc + c.cat + c.mode + c.campus).toLowerCase();
    return (!term || hay.includes(term))
        && (!fCat || c.cat===fCat)
        && (!fCap || c.campus===fCap)
        && (!fMod || c.mode===fMod);
  });

  switch (sort?.value){
    case 'price-asc': items.sort((a,b)=>a.price-b.price); break;
    case 'price-desc':items.sort((a,b)=>b.price-a.price); break;
    case 'duration-asc':items.sort((a,b)=>a.duration-b.duration); break;
    case 'start-asc': items.sort((a,b)=>new Date(a.start)-new Date(b.start)); break;
  }

  list.innerHTML = '';
  items.forEach(c=>{
    const el = document.createElement('article');
    el.className = 'card course';
    el.innerHTML = `
      <h3>${c.title}</h3>
      <p class="muted">${c.desc.length>120? c.desc.slice(0,120)+'…' : c.desc}</p>
      <div class="meta">
        <span class="badge">${c.cat}</span>
        <span class="badge">${c.mode}</span>
        <span class="badge">${c.duration} Wochen</span>
        <span class="badge">${DL.CHF(c.price)}</span>
        <span class="badge">Start: ${fmtDate(c.start)}</span>
        <span class="badge">${c.campus}</span>
      </div>
      <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn secondary" data-detail="${c.id}">Details</button>
        <button class="btn ghost" data-save="${c.id}">${DL.state.wishlist.includes(c.id) ? "Gemerkt ✓" : "Merken +"}</button>
        <button class="btn" data-book="${c.id}">Buchen</button>
      </div>`;
    list.appendChild(el);
  });
}

/* Filter-Events */
[q,cat,campus,mode,sort].forEach(el=>{
  el?.addEventListener('input', render);
  el?.addEventListener('change', render);
});
render();

/* ---------- List-Actions (Delegation) ---------- */
list?.addEventListener('click', (e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  const idDetail = Number(btn.getAttribute('data-detail'));
  const idSave   = Number(btn.getAttribute('data-save'));
  const idBook   = Number(btn.getAttribute('data-book'));
  if(idDetail) openDetail(idDetail);
  if(idSave)   { toggleSave(idSave); render(); }
  if(idBook)   openBook(idBook);
});

/* ---------- Wishlist ---------- */
function toggleSave(id){
  const i = DL.state.wishlist.indexOf(id);
  if(i>=0) DL.state.wishlist.splice(i,1);
  else DL.state.wishlist.push(id);
  DL.save();
}

/* ---------- Details-Overlay ---------- */
function openDetail(id){
  const c = DL.state.courses.find(x=>x.id===id); if(!c || !detailBox) return;
  currentCourse = c;
  dTitle.textContent = c.title;
  dDesc.textContent  = c.desc;
  dMeta.innerHTML = `
    <p><b>Kategorie:</b> ${c.cat}</p>
    <p><b>Modus:</b> ${c.mode}</p>
    <p><b>Dauer:</b> ${c.duration} Wochen</p>
    <p><b>Preis:</b> ${DL.CHF(c.price)}</p>
    <p><b>Standort:</b> ${c.campus}</p>
    <p><b>Starttermin:</b> ${fmtDate(c.start)}</p>
  `;
  dSave.textContent = DL.state.wishlist.includes(c.id) ? "Gemerkt ✓" : "Merken +";
  dSave.onclick = ()=>{ toggleSave(c.id); dSave.textContent = DL.state.wishlist.includes(c.id) ? "Merken +" : "Gemerkt ✓"; };
  dBook.onclick = ()=> openBook(c.id);

  detailBox.classList.add('open');
  detailBox.setAttribute('aria-hidden','false');
}

dClose?.addEventListener('click', ()=>{
  detailBox.classList.remove('open');
  detailBox.setAttribute('aria-hidden','true');
});
detailBox?.addEventListener('click', (e)=>{
  if(e.target === detailBox){
    detailBox.classList.remove('open');
    detailBox.setAttribute('aria-hidden','true');
  }
});

/* ---------- Buchungs-Overlay ---------- */
function openBook(id){
  const c = DL.state.courses.find(x=>x.id===id); if(!c || !bookBox) return;
  currentCourse = c;
  bkLine.textContent = `${c.title} • ${c.campus} • Start: ${fmtDate(c.start)}`;
  bkCourseId.value = c.id;
  bkCampus.value   = c.campus;
  bkStart.value    = fmtDate(c.start);

  // Falls Details offen ist, schließen
  if(detailBox?.classList.contains('open')){
    detailBox.classList.remove('open');
    detailBox.setAttribute('aria-hidden','true');
  }

  bookBox.classList.add('open');
  bookBox.setAttribute('aria-hidden','false');
}

bookClose?.addEventListener('click', ()=> {
  bookBox.classList.remove('open');
  bookBox.setAttribute('aria-hidden','true');
});
bookCancel?.addEventListener('click', ()=> {
  bookBox.classList.remove('open');
  bookBox.setAttribute('aria-hidden','true');
});
bookBox?.addEventListener('click', (e)=>{
  if(e.target === bookBox){
    bookBox.classList.remove('open');
    bookBox.setAttribute('aria-hidden','true');
  }
});

/* Buchung absenden (Demo) */
bookForm?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(bookForm).entries());
  if(!data.vorname || !data.nachname || !data.email){
    toast("Bitte Vorname, Nachname und E-Mail ausfüllen."); return;
  }
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)){
    toast("Bitte gültige E-Mail eingeben."); return;
  }
  toast("Danke! Buchung wurde gesendet (Demo).");
  bookForm.reset();
  bookBox.classList.remove('open');
  bookBox.setAttribute('aria-hidden','true');
});

<script src="assets/js/common.js"></script>
