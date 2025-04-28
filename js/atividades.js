document.addEventListener('DOMContentLoaded', () => {
  atualizarProgressBar(80);

  const formAtividades = document.getElementById('formAtividades');
  const assistiuEventoSelect = document.getElementById('assistiuEvento');
  const divEventosAssistidos = document.getElementById('divEventosAssistidos');

  const atividadesTags = document.getElementById('atividadesTags');
  const comprasTags = document.getElementById('comprasTags');
  const eventosAssistidosTags = document.getElementById('eventosAssistidosTags');

  const atividadesLista = [
    "IEM Katowice", "IEM Cologne", "Valorant Champions", "CBLOL", "Kings League", "BLAST Premier", "Nenhum"
  ];
  const comprasLista = [
    "Camisa Oficial", "Boné FURIA", "Jaqueta FURIA", "Mochila FURIA", "Mousepad FURIA", "Nenhum"
  ];
  const eventosAssistidosLista = [
    "IEM Katowice", "IEM Cologne", "Valorant Champions", "CBLOL", "Kings League", "BLAST Premier"
  ];

  criarTags(atividadesLista, atividadesTags);
  criarTags(comprasLista, comprasTags);
  criarTags(eventosAssistidosLista, eventosAssistidosTags);

  assistiuEventoSelect.addEventListener('change', () => {
    if (assistiuEventoSelect.value === 'sim') {
      divEventosAssistidos.style.display = 'block';
    } else {
      divEventosAssistidos.style.display = 'none';
    }
  });

  formAtividades.addEventListener('submit', (e) => {
    e.preventDefault();

    const atividadesSelecionadas = getSelecionados(atividadesTags);
    const comprasSelecionadas = getSelecionados(comprasTags);
    const assistiuEvento = assistiuEventoSelect.value;
    const eventosAssistidosSelecionados = getSelecionados(eventosAssistidosTags);

    if (atividadesSelecionadas.length === 0 && comprasSelecionadas.length === 0) {
      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '⚠️ Atenção!',
        text: 'Preencha ao menos uma atividade ou compra!',
        icon: 'warning',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'OK 🔥'
      });
      return;
    }

    const dadosFas = JSON.parse(localStorage.getItem('fas')) || {};

    dadosFas.atividades = atividadesSelecionadas;
    dadosFas.compras = comprasSelecionadas;
    dadosFas.assistiuEvento = assistiuEvento;
    dadosFas.eventosAssistidos = assistiuEvento === 'sim' ? eventosAssistidosSelecionados : [];
    dadosFas.xp = (dadosFas.xp || 0) + 20;
    dadosFas.carimbos = [...(dadosFas.carimbos || []), 'Presença Confirmada'];

    localStorage.setItem('fas', JSON.stringify(dadosFas));

    Swal.fire({
      background: '#111',
      color: '#fff',
      title: '✅ Atividades Registradas!',
      text: 'Vamos para a etapa final!',
      icon: 'success',
      iconColor: '#f00',
      confirmButtonColor: '#f00',
      confirmButtonText: 'Finalizar 🚀'
    }).then(() => {
      window.location.href = "journey.html";
    });
  });
});

function criarTags(lista, container) {
  lista.forEach(item => {
    const tag = document.createElement('div');
    tag.classList.add('tag-item');
    tag.textContent = item;
    tag.dataset.value = item;
    tag.addEventListener('click', () => {
      tag.classList.toggle('selected');
    });
    container.appendChild(tag);
  });
}

function getSelecionados(container) {
  return Array.from(container.querySelectorAll('.selected')).map(tag => tag.dataset.value);
}

function atualizarProgressBar(porcentagem) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = porcentagem + '%';
  }
}
