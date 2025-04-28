document.addEventListener('DOMContentLoaded', () => {
  atualizarProgressBar(20);

  const formCadastro = document.getElementById('formCadastro');
  const estadoSelect = document.getElementById('estadoSelect');
  const cidadeSelect = document.getElementById('cidadeSelect');

  let dadosEstadosCidades = {};

  // Carregar Estados ao iniciar
  fetch('assets/estados-cidades.json')
    .then(response => response.json())
    .then(data => {
      dadosEstadosCidades = data;
      data.estados.forEach(estado => {
        const option = document.createElement('option');
        option.value = estado.nome;
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
      });
    })
    .catch(err => console.error('Erro ao carregar estados:', err));

  // Quando selecionar um estado
  estadoSelect.addEventListener('change', () => {
    cidadeSelect.innerHTML = '<option value="">Selecione sua Cidade</option>';
    const estadoSelecionado = estadoSelect.value;

    if (estadoSelecionado) {
      const estado = dadosEstadosCidades.estados.find(e => e.nome === estadoSelecionado);

      if (estado && estado.cidades) {
        estado.cidades.forEach(cidade => {
          const option = document.createElement('option');
          option.value = cidade;
          option.textContent = cidade;
          cidadeSelect.appendChild(option);
        });
        cidadeSelect.disabled = false;
      }
    } else {
      cidadeSelect.disabled = true;
    }
  });

  // Salvar Cadastro
  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const cpf = document.getElementById('cpf').value.trim();
    const idade = document.getElementById('idade').value.trim();
    const estado = document.getElementById('estadoSelect').value;
    const cidade = document.getElementById('cidadeSelect').value;

    if (!nome || !cpf || !idade || !estado || !cidade) {
      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '⚠️ Atenção',
        text: 'Preencha todos os campos corretamente!',
        icon: 'warning',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'OK 🔥'
      });
      return;
    }

    const dadosFas = {
      nome,
      cpf,
      idade,
      estado,
      cidade,
      xp: 10,
      carimbos: ['Identidade Confirmada']
    };

    localStorage.setItem('fas', JSON.stringify(dadosFas));

    window.location.href = "documento.html";
  });
});

function atualizarProgressBar(porcentagem) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = porcentagem + '%';
  }
}
