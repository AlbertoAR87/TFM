import React from 'react';
import LineChart from './LineChart';
import DoughnutChart from './DoughnutChart';

function Dashboard() {
  return (
    <div className="container-fluid p-4">
      <h1 className="mt-4">Bienvenido al Panel de Análisis Predictivo</h1>
      <p>Visualiza tus datos de forma interactiva.</p>
      <div className="row">
        <div className="col-lg-8">
          <div className="card bg-dark-blue text-light mb-4">
            <div className="card-body">
              <h5 className="card-title">Ventas Mensuales</h5>
              <LineChart />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card bg-dark-blue text-light mb-4">
            <div className="card-body">
              <h5 className="card-title">Distribución de Clientes</h5>
              <DoughnutChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;