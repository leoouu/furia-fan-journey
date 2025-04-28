from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import json
import requests
import psycopg2
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__, static_folder='', static_url_path='/')
CORS(app)

OCR_API_KEY = os.getenv('OCR_API_KEY')

# Banco de dados PostgreSQL
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )
    return conn

# Cria a tabela caso não exista
def criar_tabela():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS perfis (
            id SERIAL PRIMARY KEY,
            dados JSONB NOT NULL
        );
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
        cur.execute('INSERT INTO perfis (dados) VALUES (%s)', [json.dumps(dados)])
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({'mensagem': 'Perfil salvo com sucesso!'}), 201

    except Exception as e:
        print('Erro interno ao salvar perfil:', e)
        return jsonify({'erro': 'Erro interno no servidor'}), 500

@app.route('/data/perfis.json')
def listar_perfis():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT dados FROM perfis')
        registros = cur.fetchall()
        perfis = [r[0] for r in registros]
        cur.close()
        conn.close()

        return jsonify(perfis)
    except Exception as e:
        print('Erro ao buscar perfis:', e)
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
