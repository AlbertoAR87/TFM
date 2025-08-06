import React, { useState } from 'react';
import axios from 'axios';

const SalesPredictionWidget = () => {
  const [formData, setFormData] = useState({
    Temperature: '10',
    Customers: '50',
    Marketing_Spend: '20',
    Month: '1',
    DayOfWeek: '0', // Lunes
    Region: 'East', // Valor por defecto
    Promotion: false,
    Holiday: false,
  });
  const [prediction, setPrediction] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);
    setAccuracy(null);

    // Transformar datos para la API
    const apiData = {
      Temperature: parseFloat(formData.Temperature),
      Customers: parseInt(formData.Customers, 10),
      Marketing_Spend: parseFloat(formData.Marketing_Spend),
      Month: parseInt(formData.Month, 10),
      DayOfWeek: parseInt(formData.DayOfWeek, 10),
      Region_East: formData.Region === 'East' ? 1 : 0,
      Region_North: formData.Region === 'North' ? 1 : 0,
      Region_South: formData.Region === 'South' ? 1 : 0,
      // Si la región es West, todos los demás son 0
      Promotion_Yes: formData.Promotion ? 1 : 0,
      Holiday_Yes: formData.Holiday ? 1 : 0,
    };

    try {
      const token = localStorage.getItem('token');
      // Guardamos los datos para la exportación
      localStorage.setItem('salesDataForExport', JSON.stringify(apiData));

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await axios.post(
        `${API_URL}/predict/sales`,
        apiData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrediction(response.data.prediction);
      // Asumiendo que el backend ahora devuelve también el 'accuracy'
      if (response.data.accuracy_percentage) {
        setAccuracy(response.data.accuracy_percentage);
      }

    } catch (err) {
      setError('Error al obtener la predicción. Revisa la consola para más detalles.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        <div className="nes-field">
          <label htmlFor="Temperature">Temperatura (°C)</label>
          <input type="number" id="Temperature" name="Temperature" className="nes-input" value={formData.Temperature} onChange={handleChange} />
        </div>

        <div className="nes-field">
          <label htmlFor="Customers">Nº de Clientes</label>
          <input type="number" id="Customers" name="Customers" className="nes-input" value={formData.Customers} onChange={handleChange} />
        </div>

        <div className="nes-field">
          <label htmlFor="Marketing_Spend">Gasto en Marketing (€)</label>
          <input type="number" id="Marketing_Spend" name="Marketing_Spend" className="nes-input" value={formData.Marketing_Spend} onChange={handleChange} />
        </div>

        <div className="nes-field">
          <label htmlFor="Month">Mes</label>
          <div className="nes-select">
            <select id="Month" name="Month" value={formData.Month} onChange={handleChange}>
              {[...Array(12).keys()].map(m => <option key={m+1} value={m+1}>{m+1}</option>)}
            </select>
          </div>
        </div>

        <div className="nes-field">
          <label htmlFor="Region">Región</label>
          <div className="nes-select">
            <select id="Region" name="Region" value={formData.Region} onChange={handleChange}>
              <option>East</option>
              <option>West</option>
              <option>North</option>
              <option>South</option>
            </select>
          </div>
        </div>

        <div className="nes-field">
          <label htmlFor="DayOfWeek">Día de la Semana</label>
          <div className="nes-select">
            <select id="DayOfWeek" name="DayOfWeek" value={formData.DayOfWeek} onChange={handleChange}>
              <option value="0">Lunes</option>
              <option value="1">Martes</option>
              <option value="2">Miércoles</option>
              <option value="3">Jueves</option>
              <option value="4">Viernes</option>
              <option value="5">Sábado</option>
              <option value="6">Domingo</option>
            </select>
          </div>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-around', marginTop: '1rem' }}>
          <label>
            <input type="checkbox" className="nes-checkbox" name="Promotion" checked={formData.Promotion} onChange={handleChange} />
            <span>¿Promoción?</span>
          </label>
          <label>
            <input type="checkbox" className="nes-checkbox" name="Holiday" checked={formData.Holiday} onChange={handleChange} />
            <span>¿Festivo?</span>
          </label>
        </div>
      </div>

      <button type="submit" className="nes-btn is-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
        {loading ? 'Calculando...' : 'Predecir Ventas'}
      </button>

      {error && <p className="nes-text is-error" style={{ marginTop: '1rem' }}>{error}</p>}
      
      {prediction !== null && (
        <div className="nes-container is-dark with-title" style={{ marginTop: '1.5rem' }}>
          <p className="title">Resultado</p>
          <p className="nes-text is-success">Predicción de Ventas: {prediction.toFixed(2)} €</p>
          {accuracy !== null && (
             <p className="nes-text is-success">Confianza del Modelo: {accuracy.toFixed(2)}%</p>
          )}
        </div>
      )}
    </form>
  );
};

export default SalesPredictionWidget;
