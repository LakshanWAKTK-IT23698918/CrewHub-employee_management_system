import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// A separate, bare axios instance for auth calls — deliberately does NOT go
// through employeeApi's interceptors (no token to attach yet, and a failed
// login shouldn't trigger the "redirect to /login" 401 handler).
const authClient = axios.create({ baseURL: BASE_URL, timeout: 10000 });

export async function login(username, password) {
  try {
    const response = await authClient.post('/auth/login', { username, password });
    return response.data; // { token, username, expiresInMs }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Unable to reach the server. Please try again.');
  }
}
