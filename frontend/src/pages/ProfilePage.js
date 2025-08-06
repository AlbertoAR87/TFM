import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert
} from '@mui/material';
import userService from '../services/userService';
import profileService from '../services/profileService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await userService.getMe(token);
        setUser(response.data);
        setFullName(response.data.full_name);
        setCompany(response.data.company);
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await profileService.updateUser(token, { full_name: fullName, company });
      setSuccess('Perfil actualizado correctamente.');
    } catch (err) {
      setError('Error al actualizar el perfil.');
      console.error(err);
    }
  };

  if (!user) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper 
        elevation={6}
        sx={{ 
          marginTop: 8,
          padding: 4,
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Perfil de Usuario
        </Typography>
        <Typography variant="h6">ID de Usuario: {user.id}</Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>Email: {user.email}</Typography>
        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="fullName"
            label="Nombre Completo"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="company"
            label="Empresa"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Actualizar Perfil
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;