document.addEventListener('DOMContentLoaded', () => {
  const dadosFas = JSON.parse(localStorage.getItem('fas')) || {};

  if (!dadosFas.nome) {
    Swal.fire({
      background: '#111',
      color: '#fff',
      title: '⚠️ Erro!',
      text: 'Nenhum dado encontrado. Redirecionando...',
      icon: 'error',
      iconColor: '#f00',
      confirmButtonColor: '#f00',
      confirmButtonText: 'OK 🔥'
    }).then(() => {
      window.location.href = 'index.html';
    });
    return;
  }

  const redes = dadosFas.redes || [];
  const socialScore = calcularSocialScore(redes.length);

  const analyzerDiv = document.getElementById('analyzer');
  analyzerDiv.innerHTML = `
    <p><strong>👤 Nome:</strong> ${dadosFas.nome}</p>
    <p><strong>📍 Estado:</strong> ${dadosFas.estado}</p>
    <p><strong>🏙️ Cidade:</strong> ${dadosFas.cidade}</p>
    <p><strong>🌐 Redes Conectadas:</strong> ${redes.join(', ') || 'Nenhuma'}</p>
    <p><strong>📈 Social Score:</strong> ${socialScore}</p>
  `;
});

function calcularSocialScore(qtdRedes) {
  if (qtdRedes >= 4) return "🔥 Ultra Conectado";
  if (qtdRedes >= 2) return "🏆 Engajado";
  if (qtdRedes >= 1) return "😎 Iniciante";
  return "❌ Nenhuma rede conectada";
}
