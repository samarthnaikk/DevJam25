import requests
from nacl import public
import base64
import secrets

RELAY_URL = "http://127.0.0.1:5004"  # Replace with your relay server IP

# Load receiver's public key
with open("receiver_public.key", "rb") as f:
    receiver_pk = public.PublicKey(f.read())

# Encrypt message
message = input("Enter your message: ")
box = public.SealedBox(receiver_pk)
encrypted = box.encrypt(message.encode())

# Encode as base64 so it can be sent as JSON
encrypted_b64 = base64.b64encode(encrypted).decode()

# Generate a random short code
code = secrets.token_hex(3)  # 6 hex digits (~short enough)
print(f"Share this code with the receiver: {code}")

# Send to relay
resp = requests.post(f"{RELAY_URL}/send", json={"code": code, "message": encrypted_b64})
if resp.ok:
    print("Message sent to relay!")
