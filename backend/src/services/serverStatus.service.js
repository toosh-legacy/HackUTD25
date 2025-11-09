import { db } from '../firebase.js';

export class ServerStatusService {
  static async getServerStatus() {
    try {
      const doc = await db.collection('system').doc('serverStatus').get();
      
      if (!doc.exists) {
        // Create default status if it doesn't exist
        await this.setServerStatus('online', 'system');
        return { status: 'online', updatedAt: new Date().toISOString() };
      }

      return doc.data();
    } catch (error) {
      console.error('Error getting server status:', error);
      throw error;
    }
  }

  static async setServerStatus(status, userId) {
    try {
      const validStatuses = ['online', 'maintenance', 'down'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be: online, maintenance, or down');
      }

      const statusData = {
        status,
        updatedBy: userId,
        updatedAt: new Date().toISOString()
      };

      await db.collection('system').doc('serverStatus').set(statusData, { merge: true });
      return statusData;
    } catch (error) {
      console.error('Error setting server status:', error);
      throw error;
    }
  }
}
