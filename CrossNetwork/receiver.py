import requests
from nacl import public
import base64

RELAY_URL = "http://127.0.0.1:5004"  # Replace with relay server IP

# Load receiver's private key
with open("receiver_secret.key", "rb") as f:
    receiver_sk = public.PrivateKey(f.read())

code = input("Enter the code: ")

# Get the encrypted message from relay
resp = requests.get(f"{RELAY_URL}/receive/{code}")
if resp.ok:
    data = resp.json()
    encrypted_b64 = data['message']
    encrypted = base64.b64decode(encrypted_b64)

    # Decrypt
    box = public.SealedBox(receiver_sk)
    decrypted = box.decrypt(encrypted)
    print("Decrypted message:", decrypted.decode())
else:
    print("Invalid code or message not found.")
