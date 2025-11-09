import { db } from '../firebase.js';

export class AnnouncementsService {
  static async getAnnouncements() {
    try {
      const snapshot = await db.collection('announcements')
        .where('active', '==', true)
        .limit(50)
        .get();

      const announcements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort in memory by createdAt
      announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return announcements;
    } catch (error) {
      console.error('Error getting announcements:', error);
      throw error;
    }
  }

  static async createAnnouncement(title, message, userId) {
    try {
      const announcementRef = db.collection('announcements').doc();
      const announcementData = {
        title,
        message,
        active: true,
        createdBy: userId,
        createdAt: new Date().toISOString()
      };

      await announcementRef.set(announcementData);
      return { id: announcementRef.id, ...announcementData };
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  static async deleteAnnouncement(id) {
    try {
      await db.collection('announcements').doc(id).update({
        active: false
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }
}
