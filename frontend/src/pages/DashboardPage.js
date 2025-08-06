import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Responsive, WidthProvider } from 'react-grid-layout';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import userService from '../services/userService';
import SalesPredictionWidget from '../components/SalesPredictionWidget';
import MaintenancePredictionWidget from '../components/MaintenancePredictionWidget';
import ChatbotWidget from '../components/ChatbotWidget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dashboardRef = useRef(null); // Ref para el contenedor del dashboard que se exportará a PDF

  const layout = [
    { i: 'sales', x: 0, y: 0, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'maintenance', x: 6, y: 0, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'chatbot', x: 0, y: 5, w: 12, h: 6, minW: 6, minH: 5 },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          handleLogout();
          return;
        }
        const response = await userService.getMe(token);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        handleLogout();
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleExportToPDF = () => {
    const input = dashboardRef.current;
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;

        pdf.addImage(imgData, 'PNG', 0, 0, width, height > pdfHeight ? pdfHeight : height);
        pdf.save('dashboard_report.pdf');
      });
    }
  };

  const handleCalendlyClick = () => {
    window.open('https://calendly.com/alberto-jose-aroca/30min', '_blank');
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="nes-text is-primary">TFM Business Intelligence</h1>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user && <span className="nes-text" style={{ marginRight: '1.5rem' }}>Hola, {user.full_name}</span>}
          <button type="button" className="nes-btn is-primary" onClick={handleCalendlyClick}>Agendar Llamada</button>
          <button type="button" className="nes-btn" onClick={() => navigate('/profile')} style={{ marginLeft: '1rem' }}>Perfil</button>
          <button type="button" className="nes-btn is-error" onClick={handleLogout} style={{ marginLeft: '1rem' }}>Cerrar Sesión</button>
          <button type="button" className="nes-btn is-success" onClick={handleExportToPDF} style={{ marginLeft: '1rem' }}>Exportar a PDF</button>
        </div>
      </header>

      <div ref={dashboardRef}>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          draggableHandle=".nes-container-title"
        >
          <div key="sales" className="nes-container with-title">
            <h3 className="title">Predicción de Ventas</h3>
            <SalesPredictionWidget />
          </div>
          <div key="maintenance" className="nes-container with-title">
            <h3 className="title">Predicción de Averías</h3>
            <MaintenancePredictionWidget />
          </div>
          <div key="chatbot" className="nes-container with-title">
            <h3 className="title">Asistente Virtual</h3>
            <ChatbotWidget />
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default DashboardPage;
