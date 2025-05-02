# FURIA Fan Journey - Desafio Know Your Fan

### Projeto oficial desenvolvido para o desafio técnico da FURIA Tech

---

## 🔖 Visão Geral

O **FURIA Fan Journey** é uma plataforma interativa desenvolvida com **Python (Flask)** e **tecnologias web modernas** para identificar, envolver e premiar torcedores da FURIA. O projeto simula uma jornada completa de um fã com:

* Cadastro inteligente com validação por OCR de documentos
* Integração com redes sociais (Instagram, Twitter, HLTV, Twitch)
* Coleta de dados sobre participação em eventos, compras e comportamento
* Sistema de XP, níveis e recompensas personalizadas
* Geração de passaporte digital do torcedor
* Painel **Admin** com relatórios, gráficos e exportações

---

## 📈 Funcionalidades

### ✅ Cadastro de Fã

* Nome, idade, CPF, cidade e estado
* Validação de documento com OCR (API OCR.Space)
* Sistema de carimbos e progresso por etapa

### 👤 Vinculação de Redes Sociais

* Inputs para Instagram, Twitter, Twitch, HLTV
* Gera XP extra por integração

### 🎮 Participação em Atividades

* Seleção de eventos de eSports que participou ou assistiu
* Registro de produtos comprados
* Dados usados para métricas no Admin

### 📅 Painel Administrativo

* Total de cadastros, estado/cidade com mais fãs
* Média de idade dos participantes
* Top 5 eventos, produtos e locais
* Gráficos dinâmicos (Chart.js)
* Filtros por localidade
* Exportação CSV e JSON (fãs e relatórios)

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

Preencha com sua chave OCR:

```
OCR_API_KEY=sua_chave_aqui
```

4. Execute o app:

```bash
python app.py
```

5. Acesse no navegador:

```
http://localhost:5000
```

---

## 📊 Tecnologias Usadas

* **Backend:** Python 3.11, Flask, SQLite
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
* **APIs:** OCR.Space, SweetAlert2, html2pdf.js, Chart.js
* **Infra:** Render.com (deploy gratuito)

---

## 📅 Desenvolvido por Leonardo Gonçalves

Desafio FURIA Tech 2025 ⚡️

[LinkedIn](https://www.linkedin.com/in/leonardogonc) | [GitHub](https://github.com/leoouu)

