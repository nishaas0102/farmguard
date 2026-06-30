import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './axios';

// Queue for offline operations
export const offlineSyncStore = {
  async addToQueue(operation) {
    try {
      const queue = JSON.parse(await AsyncStorage.getItem('syncQueue')) || [];
      queue.push({
        ...operation,
        timestamp: Date.now(),
        id: Math.random().toString(36),
      });
      await AsyncStorage.setItem('syncQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add to queue:', error);
    }
  },

  async getQueue() {
    try {
      return JSON.parse(await AsyncStorage.getItem('syncQueue')) || [];
    } catch (error) {
      console.error('Failed to get queue:', error);
      return [];
    }
  },

  async removeFromQueue(id) {
    try {
      const queue = JSON.parse(await AsyncStorage.getItem('syncQueue')) || [];
      const filtered = queue.filter((op) => op.id !== id);
      await AsyncStorage.setItem('syncQueue', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove from queue:', error);
    }
  },

  async syncQueue() {
    const queue = await this.getQueue();
    const results = { success: 0, failed: 0, errors: [] };

    for (const operation of queue) {
      try {
        const { method, endpoint, data, id } = operation;
        const config = { method, url: endpoint, ...(data && { data }) };
        await api(config);
        await this.removeFromQueue(id);
        results.success += 1;
      } catch (error) {
        results.failed += 1;
        results.errors.push(error.message);
      }
    }

    return results;
  },
};
