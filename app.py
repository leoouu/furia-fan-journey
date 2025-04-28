from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import sqlite3
import json
import requests
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__, static_folder='', static_url_path='/')
CORS(app)

OCR_API_KEY = os.getenv('OCR_API_KEY')

DATABASE_FILE = os.path.join('data', 'perfis.db')  # Banco interno

# Garante que a pasta /data existe
os.makedirs('data', exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def criar_tabela():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS perfis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            cpf TEXT,
            idade INTEGER,
            estado TEXT,
            cidade TEXT,
            xp INTEGER,
            carimbos TEXT,
            redes TEXT,
            atividades TEXT,
            compras TEXT,
            assistiu_evento TEXT,
            eventos_assistidos TEXT,
            data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    cur.close()
    conn.close()

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

        cur.execute('''
            INSERT INTO perfis 
            (nome, cpf, idade, estado, cidade, xp, carimbos, redes, atividades, compras, assistiu_evento, eventos_assistidos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            dados.get('nome'),
            dados.get('cpf'),
            int(dados.get('idade')) if dados.get('idade') else None,
            dados.get('estado'),
            dados.get('cidade'),
            int(dados.get('xp')) if dados.get('xp') else 0,
            json.dumps(dados.get('carimbos', [])),
            json.dumps(dados.get('redes', [])),
            json.dumps(dados.get('atividades', [])),
            json.dumps(dados.get('compras', [])),
            dados.get('assistiuEvento'),
            json.dumps(dados.get('eventosAssistidos', []))
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'mensagem': 'Perfil salvo com sucesso!'}), 201

    except Exception as e:
        print('Erro interno ao salvar perfil:', e)
        return jsonify({'erro': 'Erro interno no servidor'}), 500

@app.route('/listar_perfis', methods=['GET'])
def listar_perfis():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM perfis')
        rows = cur.fetchall()

        perfis = []
        for row in rows:
            perfil = dict(row)
            for campo in ['carimbos', 'redes', 'atividades', 'compras', 'eventos_assistidos']:
                if perfil.get(campo):
                    perfil[campo] = json.loads(perfil[campo])
                else:
                    perfil[campo] = []
            perfis.append(perfil)

        cur.close()
        conn.close()

        return jsonify(perfis)

    except Exception as e:
        print('Erro ao listar perfis:', e)
        return jsonify([])

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
        print('Erro interno ao validar documento:', e)
        return jsonify({'sucesso': False, 'erro': 'Erro interno ao validar'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
