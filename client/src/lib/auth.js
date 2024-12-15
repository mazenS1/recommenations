import { API_BASE_URL } from '../config';
import { fetchWithAuth } from './apiClient';

export const login = async (email, password) => {
  try {
    console.log('Sending login request with:', { email });

    const response = await fetchWithAuth(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('Server response:', { status: response.status, data });

    if (!response.ok) {
      throw new Error(data.message || `Login failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Detailed login error:', error);
    throw error;
  }
};

export const register = async (name, email, password) => {
  const response = await fetchWithAuth(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const getCurrentUser = async () => {  
  try {  
    const response = await fetchWithAuth(`${API_BASE_URL}/users/check`, {
      method: 'GET',
    });  

    if (!response.ok) {  
      if (response.status === 401) {  
        throw new Error('Not authenticated');  
      }  
      throw new Error('Server error');  
    }  

    const data = await response.json();
    return data;  
  } catch (error) {  
    console.error('Auth check error:', error);  
    throw error;  
  }  
};

export const logout = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/logout`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response;
  } catch (error) {
    throw error;
  }
};

