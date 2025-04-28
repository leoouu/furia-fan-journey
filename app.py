from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
import os
import json
import requests
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

app = Flask(__name__, static_folder='', static_url_path='/')
CORS(app)

OCR_API_KEY = os.getenv('OCR_API_KEY')

DATA_FOLDER = os.path.join("data")
DATA_FILE = os.path.join(DATA_FOLDER, "perfis.json")

# Garante que a pasta e arquivo existam
os.makedirs(DATA_FOLDER, exist_ok=True)
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f, ensure_ascii=False, indent=2)

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

        with open(DATA_FILE, 'r+', encoding='utf-8') as f:
            try:
                perfis = json.load(f)
            except json.JSONDecodeError:
                perfis = []

            perfis.append(dados)
            f.seek(0)
            json.dump(perfis, f, ensure_ascii=False, indent=2)
            f.truncate()

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
