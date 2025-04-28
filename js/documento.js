document.addEventListener('DOMContentLoaded', () => {
  atualizarProgressBar(40);

  const formDocumento = document.getElementById('formDocumento');

  formDocumento.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('documento');
    const documento = fileInput.files[0];

    if (!documento) {
      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '❌ Erro!',
        text: 'Por favor, envie o seu documento!',
        icon: 'error',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'OK 🔥'
      });
      return;
    }

    const dadosFas = JSON.parse(localStorage.getItem('fas')) || {};

    const formData = new FormData();
    formData.append('documento', documento);
    formData.append('cpf', dadosFas.cpf);

    try {
      const response = await fetch('/validar_documento', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (result.sucesso) {
        dadosFas.xp = (dadosFas.xp || 0) + 20;
        dadosFas.carimbos = [...(dadosFas.carimbos || []), 'Documento Verificado'];

        localStorage.setItem('fas', JSON.stringify(dadosFas));

        Swal.fire({
          background: '#111',
          color: '#fff',
          title: '✅ Documento validado!',
          text: 'Seu documento foi reconhecido!',
          icon: 'success',
          iconColor: '#f00',
          confirmButtonColor: '#f00',
          confirmButtonText: 'Continuar 🔥'
        }).then(() => {
          window.location.href = "redes.html";
        });
      } else {
        Swal.fire({
          background: '#111',
          color: '#fff',
          title: '❌ Erro!',
          text: 'CPF não encontrado no documento. Verifique!',
          icon: 'error',
          iconColor: '#f00',
          confirmButtonColor: '#f00',
          confirmButtonText: 'OK 🔥'
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        background: '#111',
        color: '#fff',
        title: '❌ Erro!',
        text: 'Erro ao validar o documento.',
        icon: 'error',
        iconColor: '#f00',
        confirmButtonColor: '#f00',
        confirmButtonText: 'OK 🔥'
      });
    }
  });
});

function atualizarProgressBar(porcentagem) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = porcentagem + '%';
  }
}
