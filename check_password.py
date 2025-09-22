import bcrypt

# Your hashed password from the CSV
hashed_password = "$2b$12$echxjYohwfal9H5dpm9NceVBL/1ien9SkXgJ3uMqDNjqDpiV7UyM6"

# Test different password variations
passwords_to_test = [
    "Ishhan1109@",
    "Ishhan1109",
    "ishhan1109",
    "Ishhan_1109",
    "ishhan1109@"
]

print("Testing passwords against your hash...")
for password in passwords_to_test:
    try:
        if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
            print(f"✅ MATCH FOUND: '{password}'")
        else:
            print(f"❌ No match: '{password}'")
    except Exception as e:
        print(f"❌ Error testing '{password}': {e}")