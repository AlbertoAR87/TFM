import requests

API_URL = "http://localhost:8000"

response = requests.post(f"{API_URL}/users/", json={
    "email": "admin@admintest.test",
    "password": "test010101",
    "full_name": "Admin Test",
    "company": "Test Inc."
})

if response.status_code == 200:
    print("Usuario de prueba creado con éxito.")
else:
    print(f"Error al crear el usuario de prueba: {response.text}")
