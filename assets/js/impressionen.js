apiGet('/api/gallery').then(rows => {
  document.getElementById('gallery').innerHTML = rows.map(g => `
    <figure class="card">
      <img src="${g.url}" alt="${g.alt_text || ''}">
      <figcaption>${g.caption || g.gallery_title}</figcaption>
    </figure>
  `).join('');
}).catch(console.error);
