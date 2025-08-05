import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report, confusion_matrix
import joblib
import os

# Rutas a los datos de ejemplo
SALES_DATA_PATH = '../data/sales_data_example.csv'
MAINTENANCE_DATA_PATH = '../data/maintenance_data_example.csv'

# Directorio para guardar los modelos
MODELS_DIR = './models'
os.makedirs(MODELS_DIR, exist_ok=True)

def train_sales_model():
    print("\n--- Entrenando Modelo de Predicción de Ventas ---")
    try:
        df_sales = pd.read_csv(SALES_DATA_PATH)
        print("Datos de ventas cargados correctamente.")
    except FileNotFoundError:
        print(f"Error: {SALES_DATA_PATH} no encontrado. Creando DataFrame vacío.")
        df_sales = pd.DataFrame()
        return

    # Preprocesamiento de datos de ventas
    df_sales['Date'] = pd.to_datetime(df_sales['Date'])
    df_sales['Month'] = df_sales['Date'].dt.month
    df_sales['DayOfWeek'] = df_sales['Date'].dt.dayofweek
    df_sales = pd.get_dummies(df_sales, columns=['Region', 'Promotion', 'Holiday'], drop_first=True)
    df_sales_processed = df_sales.drop(['Date', 'Product_ID', 'Sales'], axis=1)

    X_sales = df_sales_processed
    y_sales = df_sales['Sales']

    if X_sales.empty or y_sales.empty:
        print("No hay datos suficientes para entrenar el modelo de ventas.")
        return

    X_train_sales, X_test_sales, y_train_sales, y_test_sales = train_test_split(X_sales, y_sales, test_size=0.2, random_state=42)

    model_sales = LinearRegression()
    model_sales.fit(X_train_sales, y_train_sales)

    y_pred_sales = model_sales.predict(X_test_sales)

    mse_sales = mean_squared_error(y_test_sales, y_pred_sales)
    r2_sales = r2_score(y_test_sales, y_pred_sales)

    # --- Nuevo: Cálculo del Porcentaje de Acierto ---
    # Se define un acierto si la predicción está dentro de un 10% del valor real.
    within_10_percent = np.abs((y_test_sales - y_pred_sales) / y_test_sales) <= 0.10
    accuracy_percentage = np.mean(within_10_percent) * 100
    # ----------------------------------------------------

    print(f"Error Cuadrático Medio (MSE): {mse_sales:.2f}")
    print(f"Coeficiente de Determinación (R2): {r2_sales:.2f}")
    print(f"Porcentaje de Acierto (dentro del 10%): {accuracy_percentage:.2f}%")

    joblib.dump(model_sales, os.path.join(MODELS_DIR, 'model_sales.pkl'))
    print(f"Modelo de ventas guardado en {os.path.join(MODELS_DIR, 'model_sales.pkl')}")

def train_maintenance_model():
    print("\n--- Entrenando Modelo de Predicción de Averías ---")
    try:
        df_maintenance = pd.read_csv(MAINTENANCE_DATA_PATH)
        print("Datos de mantenimiento cargados correctamente.")
    except FileNotFoundError:
        print(f"Error: {MAINTENANCE_DATA_PATH} no encontrado. Creando DataFrame vacío.")
        df_maintenance = pd.DataFrame()
        return

    # Preprocesamiento de datos de mantenimiento
    df_maintenance_processed = df_maintenance.drop(['Machine_ID', 'Failure'], axis=1)

    X_maintenance = df_maintenance_processed
    y_maintenance = df_maintenance['Failure']

    if X_maintenance.empty or y_maintenance.empty:
        print("No hay datos suficientes para entrenar el modelo de averías.")
        return

    X_train_maintenance, X_test_maintenance, y_train_maintenance, y_test_maintenance = train_test_split(X_maintenance, y_maintenance, test_size=0.2, random_state=42)

    model_maintenance = LogisticRegression(solver='liblinear', random_state=42)
    model_maintenance.fit(X_train_maintenance, y_train_maintenance)

    y_pred_maintenance = model_maintenance.predict(X_test_maintenance)

    accuracy_maintenance = accuracy_score(y_test_maintenance, y_pred_maintenance)
    report_maintenance = classification_report(y_test_maintenance, y_pred_maintenance)
    cm_maintenance = confusion_matrix(y_test_maintenance, y_pred_maintenance)

    print(f"Accuracy: {accuracy_maintenance:.2f}")
    print("Reporte de Clasificación:\n", report_maintenance)
    print("Matriz de Confusión:\n", cm_maintenance)

    joblib.dump(model_maintenance, os.path.join(MODELS_DIR, 'model_maintenance.pkl'))
    print(f"Modelo de averías guardado en {os.path.join(MODELS_DIR, 'model_maintenance.pkl')}")

if __name__ == "__main__":
    train_sales_model()
    train_maintenance_model()
