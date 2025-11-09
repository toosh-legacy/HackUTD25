import { db } from '../firebase.js';

export class ServerStatusService {
  // Get global server status
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

  // Set global server status
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

  // Get all location statuses
  static async getLocationStatuses() {
    try {
      const snapshot = await db.collection('locationStatus').get();
      
      if (snapshot.empty) {
        return {};
      }

      const statuses = {};
      snapshot.docs.forEach(doc => {
        statuses[doc.id] = doc.data();
      });

      return statuses;
    } catch (error) {
      console.error('Error getting location statuses:', error);
      throw error;
    }
  }

  // Set status for a specific location
  static async setLocationStatus(locationId, status, userId) {
    try {
      const validStatuses = ['online', 'maintenance', 'down'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status. Must be: online, maintenance, or down');
      }

      const statusData = {
        status,
        locationId,
        updatedBy: userId,
        updatedAt: new Date().toISOString()
      };

      await db.collection('locationStatus').doc(locationId).set(statusData, { merge: true });
      return statusData;
    } catch (error) {
      console.error('Error setting location status:', error);
      throw error;
    }
  }

  // Initialize all locations with default online status
  static async initializeLocationStatuses(locationIds) {
    try {
      const batch = db.batch();
      const timestamp = new Date().toISOString();

      for (const locationId of locationIds) {
        const ref = db.collection('locationStatus').doc(locationId);
        const doc = await ref.get();
        
        if (!doc.exists) {
          batch.set(ref, {
            status: 'online',
            locationId,
            updatedBy: 'system',
            updatedAt: timestamp
          });
        }
      }

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error('Error initializing location statuses:', error);
      throw error;
    }
  }
}
