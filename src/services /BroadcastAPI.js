import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BROADCAST_API_URL;

export const BroadcastAPI = {
  async getCurrentState() {
    try {
      const response = await axios.get(`${API_BASE_URL}/state`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current state:', error);
      throw error;
    }
  },

  async updateState(state) {
    try {
      const response = await axios.post(`${API_BASE_URL}/state`, state, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating state:', error);
      throw error;
    }
  },

  async startBroadcast() {
    try {
      const response = await axios.post(`${API_BASE_URL}/start`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error starting broadcast:', error);
      throw error;
    }
  },

  async endBroadcast() {
    try {
      const response = await axios.post(`${API_BASE_URL}/end`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error ending broadcast:', error);
      throw error;
    }
  },

  async savePreset(preset) {
    try {
      const response = await axios.post(`${API_BASE_URL}/presets`, preset, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving preset:', error);
      throw error;
    }
  },

  async loadPreset(presetId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/presets/${presetId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error loading preset:', error);
      throw error;
    }
  }
};