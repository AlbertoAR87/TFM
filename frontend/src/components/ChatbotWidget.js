import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatbotWidget = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt || loading) return;

    const newMessages = [...messages, { role: 'user', text: prompt }];
    setMessages(newMessages);
    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await axios.post(
        `${API_URL}/chat`,
        { prompt: currentPrompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages([...newMessages, { role: 'bot', text: response.data.response }]);
    } catch (err) {
      setError('Error al contactar con el chatbot.');
      setMessages([...newMessages, { role: 'bot', text: 'Lo siento, no puedo responder ahora mismo.' }]);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="nes-container" style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem' }}>
        <div className="messages">
          {messages.map((msg, index) => (
            <section key={index} className={`message -${msg.role === 'user' ? 'right' : 'left'}`}>
              <div className={`nes-balloon from-${msg.role === 'user' ? 'right' : 'left'}`}>
                <p>{msg.text}</p>
              </div>
            </section>
          ))}
           {loading && (
             <section className="message -left">
                <div className="nes-balloon from-left">
                  <p>...</p>
                </div>
              </section>
           )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
        <div className="nes-field is-inline" style={{ flexGrow: 1 }}>
          <input 
            type="text" 
            id="prompt_field" 
            className="nes-input" 
            placeholder="Escribe tu pregunta..." 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className={`nes-btn ${loading ? 'is-disabled' : 'is-primary'}`} disabled={loading}>
          Enviar
        </button>
      </form>
      {error && <p className="nes-text is-error" style={{ marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default ChatbotWidget;
