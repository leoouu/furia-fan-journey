document.addEventListener('DOMContentLoaded', () => {
  carregarMetricas();
  configurarBotoesDownload();
});

let todosPerfis = [];
let estadosCache = {}, cidadesCache = {}, eventosCache = {}, comprasCache = {}, assistidosCache = {};

async function carregarMetricas() {
  try {
    const response = await fetch('data/perfis.json');
    const perfis = await response.json();
    todosPerfis = perfis;

    if (!Array.isArray(perfis) || perfis.length === 0) {
      document.getElementById('totalFas').textContent = "Nenhum fã encontrado.";
      return;
    }

    document.getElementById('totalFas').textContent = perfis.length;

    const estados = {}, cidades = {}, eventos = {}, compras = {}, assistidos = {};
    let cadastrosHoje = 0, somaIdades = 0, totalIdades = 0;
    const hoje = new Date().toISOString().split('T')[0];

    perfis.forEach(perfil => {
      if (perfil.estado) estados[perfil.estado] = (estados[perfil.estado] || 0) + 1;
      if (perfil.cidade) cidades[perfil.cidade] = (cidades[perfil.cidade] || 0) + 1;
    
      if (Array.isArray(perfil.atividades)) {
        perfil.atividades.forEach(a => {
          if (a !== "Nenhum") eventos[a] = (eventos[a] || 0) + 1;
        });
      }
    
      if (Array.isArray(perfil.compras)) {
        perfil.compras.forEach(c => {
          if (c !== "Nenhum") compras[c] = (compras[c] || 0) + 1;
        });
      }
    
      if (Array.isArray(perfil.eventosAssistidos)) {
        perfil.eventosAssistidos.forEach(a => {
          if (a !== "Nenhum") assistidos[a] = (assistidos[a] || 0) + 1;
        });
      }
    
      if (perfil.dataCadastro && perfil.dataCadastro.startsWith(hoje)) cadastrosHoje++;
      if (perfil.idade && !isNaN(perfil.idade)) {
        somaIdades += parseInt(perfil.idade);
        totalIdades++;
      }
    });    

    estadosCache = estados;
    cidadesCache = cidades;
    eventosCache = eventos;
    comprasCache = compras;
    assistidosCache = assistidos;

    document.getElementById('cadastrosHoje').textContent = cadastrosHoje;

    const estadoTop = Object.entries(estados).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('estadoTop').textContent = estadoTop ? `${estadoTop[0]} (${estadoTop[1]})` : 'N/A';

    const cidadeTop = Object.entries(cidades).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('cidadeTop').textContent = cidadeTop ? `${cidadeTop[0]} (${cidadeTop[1]})` : 'N/A';

    const mediaIdade = totalIdades ? (somaIdades / totalIdades).toFixed(1) : 'N/A';
    document.getElementById('mediaIdade').textContent = mediaIdade !== 'N/A' ? `${mediaIdade} anos` : 'N/A';

    gerarGraficoEstados(estados);
    gerarTop5(estados, cidades, eventos, compras, assistidos);
    gerarGraficosDoughnut(compras, assistidos);
    preencherFiltros(estados, cidades);

  } catch (error) {
    console.error("Erro ao carregar métricas:", error);
  }
}

function gerarGraficoEstados(estados) {
  const ctx = document.getElementById('graficoEstados').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(estados),
      datasets: [{
        label: 'Número de Fãs por Estado',
        data: Object.values(estados),
        backgroundColor: 'rgba(255, 0, 0, 0.7)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, ticks: { color: '#fff' } },
        x: { ticks: { color: '#fff' } }
      },
      plugins: {
        legend: { labels: { color: '#fff' } }
      }
    }
  });
}

function gerarTop5(estados, cidades, eventos, compras, assistidos) {
  gerarLista('topEstados', estados);
  gerarLista('topCidades', cidades);
  gerarLista('topEventos', eventos);
  gerarLista('topCompras', compras);
  gerarLista('topAssistidos', assistidos);
}

function gerarLista(id, objeto) {
  const lista = Object.entries(objeto).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const ul = document.getElementById(id);
  if (!ul) return;
  ul.innerHTML = "";
  lista.forEach(([item, count], index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}° ${item} - ${count} fãs`;
    ul.appendChild(li);
  });
}

function gerarGraficosDoughnut(compras, assistidos) {
  const comprasTop3 = Object.entries(compras).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const assistidosTop3 = Object.entries(assistidos).sort((a, b) => b[1] - a[1]).slice(0, 3);

  new Chart(document.getElementById('graficoCompras').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: comprasTop3.map(c => c[0]),
      datasets: [{
        data: comprasTop3.map(c => c[1]),
        backgroundColor: ['#ff0000', '#ff6600', '#ffaa00']
      }]
    }
  });

  new Chart(document.getElementById('graficoAssistidos').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: assistidosTop3.map(a => a[0]),
      datasets: [{
        data: assistidosTop3.map(a => a[1]),
        backgroundColor: ['#ff0000', '#ff6600', '#ffaa00']
      }]
    }
  });
}


function preencherFiltros(estados, cidades) {
  const estadoSelect = document.getElementById('filtroEstado');
  const cidadeSelect = document.getElementById('filtroCidade');

  Object.keys(estados).forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    estadoSelect.appendChild(option);
  });

  estadoSelect.addEventListener('change', () => {
    cidadeSelect.innerHTML = '<option value="">Filtrar por Cidade</option>';
    cidadeSelect.disabled = true;

    const estadoSelecionado = estadoSelect.value;

    if (estadoSelecionado) {
      cidadeSelect.disabled = false;

      const cidadesDoEstado = todosPerfis
        .filter(p => p.estado === estadoSelecionado)
        .map(p => p.cidade)
        .filter((value, index, self) => value && self.indexOf(value) === index);

      cidadesDoEstado.forEach(cidade => {
        const option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        cidadeSelect.appendChild(option);
      });
    }

    aplicarFiltro();
  });

  cidadeSelect.addEventListener('change', aplicarFiltro);
}

function aplicarFiltro() {
  const estado = document.getElementById('filtroEstado').value;
  const cidade = document.getElementById('filtroCidade').value;

  let filtrados = todosPerfis;

  if (estado) filtrados = filtrados.filter(p => p.estado === estado);
  if (cidade) filtrados = filtrados.filter(p => p.cidade === cidade);

  document.getElementById('resultadoFiltro').textContent = `🎯 Fãs encontrados: ${filtrados.length}`;
}

function configurarBotoesDownload() {
  document.getElementById('btnBaixarJSON').addEventListener('click', () => {
    const json = JSON.stringify(todosPerfis, null, 2);
    baixarArquivo(json, 'relatorio_furia_fans.json', 'application/json');
  });

  document.getElementById('btnBaixarCSV').addEventListener('click', () => {
    const csv = gerarCSV(todosPerfis);
    baixarArquivo(csv, 'relatorio_furia_fans.csv', 'text/csv');
  });

  document.getElementById('btnTop5JSON').addEventListener('click', () => {
    const top5 = gerarTop5Resumo();
    const json = JSON.stringify(top5, null, 2);
    baixarArquivo(json, 'relatorio_top5_furia.json', 'application/json');
  });

  document.getElementById('btnTop5CSV').addEventListener('click', () => {
    const top5 = gerarTop5Resumo();
    const csv = gerarCSVArray(top5);
    baixarArquivo(csv, 'relatorio_top5_furia.csv', 'text/csv');
  });
}

function gerarTop5Resumo() {
  return {
    estados: top5(estadosCache),
    cidades: top5(cidadesCache),
    eventos: top5(eventosCache),
    compras: top5(comprasCache),
    assistidos: top5(assistidosCache)
  };
}

function top5(objeto) {
  return Object.entries(objeto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([item, qtd]) => ({ item, qtd }));
}

function gerarCSV(data) {
  if (!data.length) return '';
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
  return [header, ...rows].join('\n');
}

function gerarCSVArray(data) {
  if (typeof data !== 'object') return '';

  let csvContent = "";
  for (const categoria in data) {
    csvContent += `Categoria: ${categoria}\nItem,Quantidade\n`;
    data[categoria].forEach(item => {
      csvContent += `${item.item},${item.qtd}\n`;
    });
    csvContent += '\n';
  }
  return csvContent.trim();
}

function baixarArquivo(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
