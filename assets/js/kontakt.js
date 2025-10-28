apiGet('/api/standorte').then(rows => {
  document.getElementById('standorte').innerHTML = rows.map(s => `
    <div class="card">
      <h3>${s.name}</h3>
      <p>${s.adresse || ''}</p>
      <small>${s.stadt}</small>
    </div>
  `).join('');
}).catch(console.error);
