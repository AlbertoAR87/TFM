import axios from 'axios';

const API_URL = 'http://localhost:8000';

const updateUser = (token, userData) => {
  return axios.put(`${API_URL}/users/me/`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const profileService = {
  updateUser,
};

export default profileService;