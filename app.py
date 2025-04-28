from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import psycopg2
from urllib.parse import urlparse
import requests
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__, static_folder='', static_url_path='/')
CORS(app)

OCR_API_KEY = os.getenv('OCR_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

# Função para conectar ao PostgreSQL
def get_db_connection():
    if not DATABASE_URL:
        raise Exception("DATABASE_URL não configurada!")

    result = urlparse(DATABASE_URL)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port

    conn = psycopg2.connect(
        database=database,
        user=username,
        password=password,
        host=hostname,
        port=port
    )
    return conn

# Função para criar a tabela se não existir
def criar_tabela():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS perfis (
            id SERIAL PRIMARY KEY,
            nome TEXT,
            cpf TEXT,
            idade INTEGER,
            estado TEXT,
            cidade TEXT,
            xp INTEGER,
            carimbos TEXT[],
            redes TEXT[],
            atividades TEXT[],
            compras TEXT[],
            assistiu_evento TEXT,
            eventos_assistidos TEXT[]
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

# Criar a tabela ao iniciar o servidor
criar_tabela()

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('', path)

@app.route('/salvar_perfil', methods=['POST'])
def salvar_perfil():
    try:
        dados = request.json
        if not dados or not dados.get('nome'):
            return jsonify({'erro': 'Dados inválidos'}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO perfis (
                nome, cpf, idade, estado, cidade, xp,
                carimbos, redes, atividades, compras,
                assistiu_evento, eventos_assistidos
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            dados.get('nome'),
            dados.get('cpf'),
            int(dados.get('idade')) if dados.get('idade') else None,
            dados.get('estado'),
            dados.get('cidade'),
            int(dados.get('xp')) if dados.get('xp') else 0,
            dados.get('carimbos', []),
            dados.get('redes', []),
            dados.get('atividades', []),
            dados.get('compras', []),
            dados.get('assistiuEvento'),
            dados.get('eventosAssistidos', [])
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'mensagem': 'Perfil salvo com sucesso!'}), 201

    except Exception as e:
        print('Erro interno:', e)
        return jsonify({'erro': 'Erro interno no servidor'}), 500

@app.route('/validar_documento', methods=['POST'])
def validar_documento():
    try:
        if 'documento' not in request.files or 'cpf' not in request.form:
            return jsonify({'sucesso': False, 'erro': 'Dados insuficientes'}), 400

        documento = request.files['documento']
        cpf_informado = request.form['cpf'].replace('.', '').replace('-', '')

        payload = {
            'apikey': OCR_API_KEY,
            'language': 'por',
        }
        files = {'file': (documento.filename, documento.stream, documento.mimetype)}

        response = requests.post('https://api.ocr.space/parse/image', data=payload, files=files)
        result = response.json()

        texto = result.get('ParsedResults', [{}])[0].get('ParsedText', '')
        texto_limpo = ''.join(filter(str.isdigit, texto))

        if cpf_informado in texto_limpo:
            return jsonify({'sucesso': True})
        else:
            return jsonify({'sucesso': False})

    except Exception as e:
        print('Erro interno:', e)
        return jsonify({'sucesso': False, 'erro': 'Erro interno ao validar'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
