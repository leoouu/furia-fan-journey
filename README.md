# FURIA Fan Journey - Know Your Fan Challenge

### Projeto oficial desenvolvido para o desafio técnico da FURIA Tech!

---

## 🔖 Sobre o Projeto
O **FURIA Fan Journey** é uma plataforma web completa em **Flask + HTML/CSS/JavaScript**, que:

- Realiza o cadastro de fãs com validação de dados.
- Valida documentos e CPF via OCR automático.
- Permite adicionar e contabilizar redes sociais vinculadas.
- Coleta informações sobre atividades, compras e eventos assistidos.
- Gera XP automático e atribui níveis ao fã.
- Emite um passaporte digital personalizado.
- Entrega recompensas virtuais baseadas na participação.
- Disponibiliza um **painel Admin** com análises, gráficos e exportações de dados.

---

## 📷 Demonstração
- Cadastro fluido e visual responsivo.
- Seleção automática de estados e cidades do Brasil.
- Análise de documentos usando a API **OCR.Space**.
- Sistema de XP e **evolução de fã**.
- Dashboard Admin com:
  - Top 5 Estados, Cidades, Produtos e Eventos.
  - Gráficos dinâmicos com Chart.js.
  - Exportação em CSV e JSON.
  - Análise de cadastros diários e média de idade.

---

## 🔧 Como Rodar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/leoouu/furia-fan-journey
cd furia-fan-journey
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Configure o arquivo `.env`:
```bash
cp .env.example .env
```
Preencha o `.env` com sua chave OCR:
```
OCR_API_KEY=sua_chave_aqui
```

4. Rode o servidor:
```bash
python app.py
```

5. Acesse no navegador:
```url
http://localhost:5000/

---

## 📚 Tecnologias Utilizadas
- Python 3.11
- Flask
- Flask-CORS
- SQLite (local)
- OCR.Space API
- Chart.js
- SweetAlert2
- html2pdf.js
- Render.com (deploy)

---

## 📅 Feito por Leonardo Gonçalves - 2025
Projeto realizado com paixão pelo desafio FURIA Tech! 💥

[LinkedIn](www.linkedin.com/in/leonardogonc) | [GitHub](https://github.com/leoouu)

---

**🚀 Let's Go FURIA!**

