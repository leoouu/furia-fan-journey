document.addEventListener('DOMContentLoaded', () => {
  atualizarProgressBar(60);

  const formRedes = document.getElementById('formRedes');

  formRedes.addEventListener('submit', (e) => {
    e.preventDefault();

    const instagram = document.getElementById('instagram').value.trim();
    const twitter = document.getElementById('twitter').value.trim();
    const twitch = document.getElementById('twitch').value.trim();
    const hltv = document.getElementById('hltv').value.trim();

    const redes = [];
    let xpExtra = 0;

    if (instagram) {
      redes.push(`Instagram: ${instagram}`);
      xpExtra += 10;
    }
    if (twitter) {
      redes.push(`Twitter: ${twitter}`);
      xpExtra += 10;
    }
    if (twitch) {
      redes.push(`Twitch: ${twitch}`);
      xpExtra += 10;
    }
    if (hltv) {
      redes.push(`HLTV: ${hltv}`);
      xpExtra += 10;
    }

    if (redes.length === 0) {
      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '⚠️ Atenção!',
        text: 'Preencha pelo menos uma rede social!',
        icon: 'warning',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'OK 🔥'
      });
      return;
    }

    const dadosFas = JSON.parse(localStorage.getItem('fas')) || {};

    dadosFas.redes = redes;
    dadosFas.xp = (dadosFas.xp || 0) + 15 + xpExtra; // 15 base + bônus
    dadosFas.carimbos = [...(dadosFas.carimbos || []), 'Socialmente Conectado'];

    localStorage.setItem('fas', JSON.stringify(dadosFas));

    Swal.fire({
      background: '#111',
      color: '#fff',
      title: '✅ Redes Conectadas!',
      html: `Suas redes foram salvas!<br><br><strong>🔥 Você ganhou +${15 + xpExtra} XP!</strong>`,
      icon: 'success',
      iconColor: '#f00',
      confirmButtonColor: '#f00',
      confirmButtonText: 'Próxima Etapa ➡️'
    }).then(() => {
      window.location.href = "atividades.html";
    });
  });
});

function atualizarProgressBar(porcentagem) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = porcentagem + '%';
  }
}
