apiGet('/api/kurse').then(rows => {
  document.getElementById('kurse').innerHTML = rows.map(k => `
    <article class="card">
      <h3>${k.title}</h3>
      <p>${k.excerpt || ''}</p>
      <small>${k.starts_on || ''}</small>
    </article>
  `).join('');
}).catch(console.error);
