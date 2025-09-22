from nacl import public

sk = public.PrivateKey.generate()
pk = sk.public_key

with open("receiver_secret.key", "wb") as f:
    f.write(sk.encode())
with open("receiver_public.key", "wb") as f:
    f.write(pk.encode())
