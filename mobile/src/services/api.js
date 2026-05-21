import axios from 'axios';

// Live Vercel Backend - works 24/7 even when laptop is off
const API_BASE_URL = 'https://backend-flame-nine-61.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For iOS fallback if needed
// const API_BASE_URL_IOS = 'http://localhost:8000/api';

export const parseIntent = async (query) => {
  const response = await api.post('/parse-intent', { query });
  return response.data;
};

export const matchTeachers = async (intent) => {
  const response = await api.post('/match-teachers', intent);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post('/create-booking', bookingData);
  return response.data;
};

export const submitDispute = async (disputeData) => {
  const response = await api.post('/submit-dispute', disputeData);
  return response.data;
};

export const getAgentLogs = async () => {
  const response = await api.get('/agent-logs');
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const signupTeacher = async (data) => {
  const response = await api.post('/auth/signup/teacher', data);
  return response.data;
};

export const signupStudent = async (data) => {
  const response = await api.post('/auth/signup/student', data);
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export default api;
