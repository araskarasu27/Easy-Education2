(() => {
  const launcher = document.getElementById('ai-launcher');
  const panel = document.getElementById('ai-panel');
  const closeBtn = document.getElementById('ai-close');
  const form = document.getElementById('ai-form');
  const input = document.getElementById('ai-input');
  const box = document.getElementById('ai-messages');

  const messages = []; // Verlauf für Kontext

  function addMsg(role, text){
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  launcher.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) input.focus();
  });
  closeBtn.addEventListener('click', () => panel.hidden = true);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    addMsg('user', q);
    messages.push({ role: 'user', content: q });

    // Lade-Placeholder
    const waiter = document.createElement('div');
    waiter.className = 'msg ai';
    waiter.textContent = '…';
    box.appendChild(waiter); box.scrollTop = box.scrollHeight;

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ messages })
      });
      if (!r.ok) throw new Error('HTTP '+r.status);
      const data = await r.json(); // { reply }
      waiter.remove();
      addMsg('ai', data.reply || 'Kein Text erhalten.');
      messages.push({ role: 'assistant', content: data.reply || '' });
    } catch (err) {
      waiter.remove();
      addMsg('ai', 'Ups, da ist etwas schiefgelaufen. Versuch es gleich noch einmal.');
      console.error(err);
    }
  });
})();
