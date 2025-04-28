from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import psycopg2
import json
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__, static_folder='', static_url_path='/')
CORS(app)

OCR_API_KEY = os.getenv('OCR_API_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

def get_db_connection():
    if not DATABASE_URL:
        raise Exception("DATABASE_URL não configurada!")
    
    result = urlparse(DATABASE_URL)

    conn = psycopg2.connect(
        dbname=result.path[1:],
        user=result.username,
        password=result.password,
        host=result.hostname,
        port=result.port
    )
    return conn

def criar_tabela():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS perfis (
            id SERIAL PRIMARY KEY,
            nome TEXT,
            cpf TEXT,
            idade INT,
            estado TEXT,
            cidade TEXT,
            xp INT,
            carimbos TEXT[],
            redes TEXT[],
            atividades TEXT[],
            compras TEXT[],
            assistiu_evento TEXT,
            eventos_assistidos TEXT[],
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
            INSERT INTO perfis (nome, cpf, idade, estado, cidade, xp, carimbos, redes, atividades, compras, assistiu_evento, eventos_assistidos)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ''', (
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
        print('Erro interno ao salvar perfil:', e)
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
        print('Erro interno ao validar documento:', e)
        return jsonify({'sucesso': False, 'erro': 'Erro interno ao validar'}), 500

@app.route('/listar_perfis', methods=['GET'])
def listar_perfis():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM perfis')
        rows = cur.fetchall()

        colnames = [desc[0] for desc in cur.description]
        perfis = []
        for row in rows:
            perfil = dict(zip(colnames, row))
            # Ajustar tipos para garantir compatibilidade no frontend
            if isinstance(perfil.get('carimbos'), list) and perfil['carimbos'] is not None:
                perfil['carimbos'] = list(perfil['carimbos'])
            if isinstance(perfil.get('redes'), list) and perfil['redes'] is not None:
                perfil['redes'] = list(perfil['redes'])
            if isinstance(perfil.get('atividades'), list) and perfil['atividades'] is not None:
                perfil['atividades'] = list(perfil['atividades'])
            if isinstance(perfil.get('compras'), list) and perfil['compras'] is not None:
                perfil['compras'] = list(perfil['compras'])
            if isinstance(perfil.get('eventos_assistidos'), list) and perfil['eventos_assistidos'] is not None:
                perfil['eventos_assistidos'] = list(perfil['eventos_assistidos'])
            perfis.append(perfil)

        cur.close()
        conn.close()

        return jsonify(perfis)
    except Exception as e:
        print('Erro ao listar perfis:', e)
        return jsonify([])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
