import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: true,

  hydrate: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const decoded = jwt_decode(token);
        if (decoded.exp * 1000 > Date.now()) {
          set({ user: decoded, token });
        } else {
          await SecureStore.deleteItemAsync('token');
        }
      }
    } catch (error) {
      console.error('Hydrate auth failed:', error);
    } finally {
      set({ loading: false });
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      await SecureStore.setItemAsync('token', data.token);
      const decoded = jwt_decode(data.token);
      set({ user: decoded, token: data.token });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    set({ user: null, token: null });
  },
}));
