# TFM Business Intelligence - Proyecto de Predicción de Ventas

Este proyecto es una aplicación web completa para la predicción de ventas y el mantenimiento predictivo, desarrollada como parte de un Trabajo de Fin de Máster (TFM).

La aplicación cuenta con un frontend interactivo construido con React y un backend potente con FastAPI que sirve un modelo de Machine Learning entrenado.

## Características Principales

- **Dashboard Interactivo:** Visualiza predicciones y métricas en tiempo real.
- **Predicción de Ventas:** Un formulario para introducir variables y obtener una predicción de ventas.
- **Mantenimiento Predictivo:** Un formulario para predecir posibles averías en maquinaria.
- **Chatbot con Gemini:** Un asistente virtual para ayudar a los usuarios.
- **Exportación a PDF:** Genera informes en PDF del estado del dashboard.
- **Autenticación de Usuarios:** Sistema de registro e inicio de sesión seguro.

## Tecnologías Utilizadas

- **Frontend:**
  - React
  - nes.css (para el estilo pixel-art)
  - Axios
  - html2canvas, jsPDF
- **Backend:**
  - FastAPI
  - Python
  - Scikit-learn, Pandas
  - SQLAlchemy
  - Google Generative AI (para el chatbot)

## Instalación

A continuación se detallan los pasos para instalar y ejecutar el proyecto en un entorno local.

### 1. Backend (FastAPI)

1.  **Navega al directorio del backend:**
    ```bash
    cd "Desktop/TFM_Business_Intelligence 2/backend"
    ```
2.  **Crea un entorno virtual e instálalo:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```
3.  **Instala las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configura las variables de entorno:**
    - Crea un archivo `.env` en la raíz de la carpeta `backend`.
    - Copia y pega el siguiente contenido, reemplazando los valores si es necesario:
      ```
      SECRET_KEY=a_very_secret_key_that_should_be_changed
      ALGORITHM=HS256
      ACCESS_TOKEN_EXPIRE_MINUTES=30
      GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
      ```
5.  **Entrena los modelos (solo la primera vez):**
    ```bash
    python train_models.py
    ```
6.  **Inicia el servidor:**
    ```bash
    uvicorn main:app --reload
    ```
    El backend estará disponible en `http://localhost:8000`.

### 2. Frontend (React)

1.  **Navega al directorio del frontend:**
    ```bash
    cd "Desktop/TFM_Business_Intelligence 2/frontend"
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    ```
3.  **Inicia la aplicación:**
    ```bash
    npm start
    ```
    El frontend estará disponible en `http://localhost:3000`.

## Uso

Una vez que ambos servidores (backend y frontend) estén en funcionamiento, abre tu navegador y ve a `http://localhost:3000`.

Deberás registrar un nuevo usuario para poder acceder al dashboard principal.
