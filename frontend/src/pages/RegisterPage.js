import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import authService from '../services/authService';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(email, password, fullName, company);
      // Después de registrar, logueamos al usuario automáticamente
      try {
        const response = await authService.login(email, password);
        localStorage.setItem('token', response.data.access_token);
        navigate('/');
      } catch (loginErr) {
        setError('Cuenta creada, pero ha ocurrido un error al iniciar sesión. Por favor, ve a la página de Login.');
      }
    } catch (registerErr) {
      if (registerErr.response && registerErr.response.data.detail === 'Email already registered') {
        setError('Este correo electrónico ya está en uso. Por favor, prueba con otro.');
      } else {
        setError('Ha ocurrido un error inesperado durante el registro.');
      }
      console.error(registerErr);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6}
        sx={{ 
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
          Crear Cuenta
        </Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Nombre Completo"
            name="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            id="company"
            label="Empresa (Opcional)"
            name="company"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electrónico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <motion.div
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 'bold' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>
          </motion.div>
          <Link component={RouterLink} to="/login" variant="body2">
            {"¿Ya tienes una cuenta? Inicia sesión"}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;