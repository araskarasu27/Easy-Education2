apiGet('/api/blog').then(rows => {
  document.getElementById('blog-list').innerHTML = rows.map(p => `
    <article class="card">
      <h3>${p.title}</h3>
      <small>${new Date(p.published_at).toLocaleDateString()}</small>
      <p>${p.excerpt || ''}</p>
    </article>
  `).join('');
}).catch(console.error);
