import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const getMe = (token) => {
  return axios.get(`${API_URL}/users/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const userService = {
  getMe,
};

export default userService;