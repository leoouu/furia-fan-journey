# FURIA Fan Journey - Know Your Fan Project

### Projeto desenvolvido para o desafio da FURIA Tech!

---

## 🔖 Sobre o Projeto
O **FURIA Fan Journey** é uma aplicação web desenvolvida em **Flask + HTML/CSS/JS** que:

- Realiza cadastro de fãs da FURIA.
- Valida documentos via OCR automático.
- Permite vincular redes sociais.
- Coleta dados de atividades, compras e eventos assistidos.
- Calcula XP e entrega recompensas (Certificado, Wallpapers, Troféus).
- Gera um passaporte de fã personalizado.
- Possui dashboard administrativo com gráficos e relatórios automáticos.

---

## 👁 Demonstração Rápida
- Cadastro com estado e cidade dinâmicos.
- Validação de CPF no documento via API OCR.Space.
- Sistema de XP com progressão de nível.
- Ranking Top 5 Estados, Cidades, Produtos e Eventos.
- Exportação de relatórios em **CSV** e **JSON**.
- Modo Dark Mode visual bonito.

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

3. Crie o arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```
- Adicione sua **API_KEY_OCR** no `.env`.

4. Rode o servidor Flask:
```bash
python app.py
```

5. Acesse o app no navegador:
```url
http://localhost:5000/
```

---

## 🎓 Tecnologias Utilizadas
- Python 3.11
- Flask
- Flask-CORS
- HTML5 + CSS3 + JavaScript (Vanilla)
- Chart.js
- SweetAlert2
- html2pdf.js

---

## 📅 Feito por Leonardo Gonçalves - 2025
**Desafio FURIA Tech** - com dedicação total ❤️


