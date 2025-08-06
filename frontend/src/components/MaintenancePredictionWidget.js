import React, { useState } from 'react';
import axios from 'axios';

const MaintenancePredictionWidget = () => {
  const [formData, setFormData] = useState({
    Sensor1: '10.5',
    Sensor2: '25.2',
    Sensor3: '5.8',
    Temperature: '80',
    Pressure: '3.5',
    Vibration: '1.2'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    // Convertir todos los valores a float
    const apiData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseFloat(value)])
    );

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await axios.post(
        `${API_URL}/predict/maintenance',
        apiData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPrediction(response.data);
    } catch (err) {
      setError('Error al obtener la predicción. Revisa la consola.');
      console.error(err);
    }
    setLoading(false);
  };

  const getResultContainerClass = () => {
    if (!prediction) return 'is-dark';
    if (prediction.prediction === 1) {
      if (prediction.probability > 0.75) return 'is-error';
      return 'is-warning';
    }
    return 'is-success';
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {Object.keys(formData).map((key) => (
          <div className="nes-field" key={key}>
            <label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
            <input 
              type="number" 
              id={key} 
              name={key} 
              className="nes-input" 
              value={formData[key]} 
              onChange={handleChange} 
              step="0.1"
            />
          </div>
        ))}

      </div>

      <button type="submit" className="nes-btn is-primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
        {loading ? 'Analizando...' : 'Predecir Avería'}
      </button>

      {error && <p className="nes-text is-error" style={{ marginTop: '1rem' }}>{error}</p>}
      
      {prediction !== null && (
        <div className={`nes-container with-title ${getResultContainerClass()}`} style={{ marginTop: '1.5rem' }}>
          <p className="title">Diagnóstico</p>
          <p><b>Estado:</b> {prediction.prediction === 1 ? 'RIESGO DE AVERÍA' : 'Funcionamiento Normal'}</p>
          <p><b>Probabilidad de Avería:</b> {(prediction.probability * 100).toFixed(2)}%</p>
        </div>
      )}
    </form>
  );
};

export default MaintenancePredictionWidget;
