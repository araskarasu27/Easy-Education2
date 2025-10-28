/* Easy Education 
– FAQ Experience */
(function(){
  const list   = document.getElementById('faqList');
  const tabs   = document.querySelectorAll('.faq-tab');
  const search = document.getElementById('faqSearch');
  const btnClr = document.getElementById('btnClear');
  const openAllBtn  = document.querySelector('[data-open-all]');
  const closeAllBtn = document.querySelector('[data-close-all]');
  const STORAGE_KEY = 'faq-open-ids';

  // --- Akkordeon Toggle (mit ARIA & Session-State)
  list.addEventListener('click', (e)=>{
    const btn = e.target.closest('.acc-head');
    if(!btn) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    saveState();
  });

  function saveState(){
    const openIds = [...list.querySelectorAll('.acc-head[aria-expanded="true"]')]
      .map(b => b.closest('.acc-item').id);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(openIds));
  }
  function restoreState(){
    try{
      const openIds = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
      openIds.forEach(id=>{
        const btn = document.querySelector(`#${id} .acc-head`);
        btn?.setAttribute('aria-expanded','true');
      });
    }catch(_){}
  }

  // --- Tabs (Kategorien)
  tabs.forEach(t=>{
    t.addEventListener('click', ()=>{
      tabs.forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected','false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected','true');
      filter({ cat: t.dataset.cat, q: search.value.trim() });
    });
  });

  // --- Suche mit Debounce + Highlight
  let timer;
  search.addEventListener('input', ()=>{
    clearTimeout(timer);
    timer = setTimeout(()=> filter({ cat: currentCat(), q: search.value.trim() }), 120);
  });
  btnClr.addEventListener('click', ()=>{
    search.value = ''; filter({ cat: currentCat(), q: '' });
  });

  function currentCat(){
    return document.querySelector('.faq-tab.is-active')?.dataset.cat || 'all';
  }

  function filter({cat='all', q='' }={}){
    const items = list.querySelectorAll('.acc-item');
    const term = q.toLowerCase();
    items.forEach(item=>{
      // Kategorie
      const okCat = (cat === 'all') || item.dataset.cat === cat;
      // Textsuche
      const text = item.textContent.toLowerCase();
      const okSearch = !term || text.includes(term);
      item.style.display = (okCat && okSearch) ? '' : 'none';

      // Highlight
      unmark(item);
      if(term && okCat && okSearch){
        highlight(item.querySelector('.acc-head'), term);
        highlight(item.querySelector('.acc-panel'), term);
        // Treffer automatisch öffnen
        item.querySelector('.acc-head').setAttribute('aria-expanded','true');
      }
    });
    saveState();
  }

  function unmark(scope){
    scope.querySelectorAll('mark.faq-hl').forEach(m=>{
      m.replaceWith(document.createTextNode(m.textContent));
    });
  }
  function highlight(el, term){
    if(!el || !term) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    while(walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach(n=>{
      const idx = n.nodeValue.toLowerCase().indexOf(term);
      if(idx >= 0){
        const span = document.createElement('span');
        span.innerHTML = n.nodeValue.substring(0, idx) +
          '<mark class="faq-hl">' + n.nodeValue.substr(idx, term.length) + '</mark>' +
          n.nodeValue.substring(idx + term.length);
        n.replaceWith(span);
      }
    });
  }

  // --- Alle öffnen/schließen
  openAllBtn?.addEventListener('click', ()=>{
    list.querySelectorAll('.acc-head').forEach(b => b.setAttribute('aria-expanded','true'));
    saveState();
  });
  closeAllBtn?.addEventListener('click', ()=>{
    list.querySelectorAll('.acc-head').forEach(b => b.setAttribute('aria-expanded','false'));
    saveState();
  });

  // --- Deep-Link #faq-xyz
  function openFromHash(){
    const id = location.hash.slice(1);
    if(!id) return;
    const item = document.getElementById(id);
    if(item){
      item.style.display = '';
      item.querySelector('.acc-head').setAttribute('aria-expanded','true');
      item.scrollIntoView({behavior:'smooth', block:'start'});
      saveState();
    }
  }
  window.addEventListener('hashchange', openFromHash);

  // Init
  restoreState();
  filter({ cat:'all', q:'' });
  openFromHash();
})();

<script src="assets/js/common.js"></script>

apiGet('/api/faq').then(rows=>{
  document.getElementById('faq').innerHTML = rows.map(q=>`
    <details><summary>${q.question}</summary><div>${q.answer}</div></details>
  `).join('');
}).catch(console.error);
