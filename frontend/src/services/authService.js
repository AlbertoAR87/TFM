import axios from 'axios';

const API_URL = 'http://localhost:8000';

const register = (email, password, fullName, company) => {
  return axios.post(`${API_URL}/users/`, {
    email,
    password,
    full_name: fullName,
    company,
  });
};

const login = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);

  return axios.post(`${API_URL}/token`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

const authService = {
  register,
  login,
};

export default authService;