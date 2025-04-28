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

  atualizarProgressBar(100);

  const xp = dadosFas.xp || 0;
  dadosFas.nivel = calcularNivel(xp);

  const passaporteDiv = document.getElementById('passaporte');
  passaporteDiv.innerHTML = `
    <div class="passaporte-box">
      <p><strong>👤 Nome:</strong> ${dadosFas.nome}</p>
      <p><strong>🎂 Idade:</strong> ${dadosFas.idade}</p>
      <p><strong>🛡️ CPF:</strong> ${dadosFas.cpf}</p>
      <p><strong>📍 Estado:</strong> ${dadosFas.estado}</p>
      <p><strong>🏙️ Cidade:</strong> ${dadosFas.cidade}</p>
      <p><strong>⭐ XP Acumulado:</strong> ${dadosFas.xp} XP</p>
      <p><strong>🔥 Nível de Fã:</strong> ${dadosFas.nivel}</p>
    </div>
  `;

  const carimbosDiv = document.getElementById('carimbos');
  carimbosDiv.innerHTML = (dadosFas.carimbos || []).map(c => `<div class="carimbo">✅ ${c}</div>`).join('');

  const recompensaDiv = document.getElementById('recompensas');
  recompensaDiv.innerHTML = gerarRecompensas(dadosFas.nivel);

  // Ações botões principais
  document.getElementById('btnFinalizar').addEventListener('click', async () => {
    try {
      dadosFas.dataCadastro = new Date().toISOString();

      await fetch('http://localhost:5000/salvar_perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosFas)
      });

      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '✅ Perfil salvo!',
        text: 'Seu passaporte foi enviado!',
        icon: 'success',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'Voltar 🔥'
      }).then(() => {
        localStorage.removeItem('fas');
        window.location.href = 'index.html';
      });

    } catch (error) {
      console.error("Erro ao salvar:", error);
      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '❌ Erro!',
        text: 'Falha ao salvar seu passaporte. Tente novamente!',
        icon: 'error',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'OK 🔥'
      });
    }
  });

  document.getElementById('btnBaixarPDF').addEventListener('click', () => {
    const passaporteElement = document.getElementById('containerPassaporte') || document.querySelector('.container');
    const nomeArquivo = `Passaporte-FURIA-${dadosFas.nome.replace(/\s+/g, '_')}.pdf`;

    const opt = {
      margin: 0,
      filename: nomeArquivo,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 4, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(passaporteElement).save();
  });

  // Modal Redes Vinculadas
  document.getElementById('btnVisualizarRedes').addEventListener('click', () => {
    const redesModal = document.getElementById('modalRedes');
    const redesContent = document.getElementById('redesModalContent');

    redesContent.innerHTML = gerarRedesVinculadas(dadosFas.redes);

    redesModal.style.display = 'flex';
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('modalRedes').style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target.id === 'modalRedes') {
      document.getElementById('modalRedes').style.display = 'none';
    }
  });
});

function calcularNivel(xp) {
  if (xp >= 100) return "🔥 Lendário";
  if (xp >= 70) return "💪 Hardcore";
  if (xp >= 40) return "🏆 Engajado";
  return "😎 Casual";
}

function gerarRecompensas(nivel) {
  let recompensas = [];

  if (["😎 Casual", "🏆 Engajado", "💪 Hardcore", "🔥 Lendário"].includes(nivel)) {
    recompensas.push(`
      <div class="recompensa-bloco">
        <img src="assets/wallpaper_cel.png" alt="Wallpaper Celular" class="recompensa-img">
        <p>🎁 Wallpaper FURIA (Celular)</p>
        <a href="assets/wallpaper_cel.png" download="Wallpaper-FURIA-Celular.png" class="download-wallpaper-btn">📥 Baixar Celular</a>
      </div>
      <div class="recompensa-bloco">
        <img src="assets/wallpaper_pc.png" alt="Wallpaper PC" class="recompensa-img">
        <p>🖥️ Wallpaper FURIA (PC)</p>
        <a href="assets/wallpaper_pc.png" download="Wallpaper-FURIA-PC.png" class="download-wallpaper-btn">📥 Baixar PC</a>
      </div>
    `);
  }
  if (["🏆 Engajado", "💪 Hardcore", "🔥 Lendário"].includes(nivel)) {
    recompensas.push(`
      <div class="recompensa-bloco">
        <img src="assets/medalha.png" alt="Medalha" class="recompensa-img">
        <p>🥇 Medalha de Honra ao Mérito</p>
      </div>
    `);
  }
  if (["💪 Hardcore", "🔥 Lendário"].includes(nivel)) {
    recompensas.push(`
      <div class="recompensa-bloco">
        <img src="assets/trofeu.png" alt="Troféu" class="recompensa-img">
        <p>🏆 Troféu FURIA Fan do Ano</p>
      </div>
    `);
  }
  if (nivel === "🔥 Lendário") {
    recompensas.push(`
      <div class="recompensa-bloco">
        <img src="assets/certificado.png" alt="Certificado" class="recompensa-img">
        <p>🎖️ Certificado de Fã Lendário</p>
      </div>
    `);
  }

  return recompensas.join('');
}

function gerarRedesVinculadas(redes) {
  if (!redes || redes.length === 0) {
    return `<p>❌ Nenhuma rede vinculada.</p>`;
  }

  return `
    <ul style="list-style: none; padding: 0;">
      ${redes.map(rede => `<li>🔗 ${rede}</li>`).join('')}
    </ul>
  `;
}

function atualizarProgressBar(porcentagem) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = porcentagem + '%';
  }
}
