from flask import Flask, request, jsonify

app = Flask(__name__)
# Store encrypted messages in memory (code -> message)
MESSAGES = {}

@app.route('/send', methods=['POST'])
def send_message():
    data = request.json
    code = data['code']
    encrypted = data['message']
    MESSAGES[code] = encrypted
    return jsonify({"status": "ok"})

@app.route('/receive/<code>', methods=['GET'])
def receive_message(code):
    if code in MESSAGES:
        encrypted = MESSAGES.pop(code)
        return jsonify({"message": encrypted})
    else:
        return jsonify({"error": "Code not found"}), 404

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5004)
