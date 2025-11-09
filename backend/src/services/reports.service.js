import { db } from '../firebase.js';

export class ReportsService {
  // Get all reports (admin only) - includes both active and resolved
  static async getReports(limit = 50, lastId = null) {
    try {
      let query = db.collection('reports')
        .limit(Number(limit));

      const snapshot = await query.get();
      
      // Sort in memory to avoid index requirement
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return reports;
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  }

  // Get reports for a specific user
  static async getUserReports(userId, limit = 50) {
    try {
      const snapshot = await db.collection('reports')
        .where('userId', '==', userId)
        .limit(Number(limit))
        .get();
      
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      return reports;
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw error;
    }
  }

  static async createReport(reportData, userId) {
    const { title, description, latitude, longitude, location, category, severity = 1 } = reportData;
    
    const reportRef = db.collection('reports').doc();
    await reportRef.set({
      title,
      description,
      latitude: latitude || null,
      longitude: longitude || null,
      location: location || null,
      category: category || title,
      severity,
      userId,
      status: 'active',
      createdAt: new Date().toISOString()
    });

    const doc = await reportRef.get();
    return { id: doc.id, ...doc.data() };
  }

  // Resolve a report (admin only)
  static async resolveReport(reportId) {
    try {
      const reportRef = db.collection('reports').doc(reportId);
      await reportRef.update({
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      });
      
      const doc = await reportRef.get();
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error resolving report:', error);
      throw error;
    }
  }

  static async getReportsByLocation(lat, lng, radiusKm = 5) {
    try {
      // Get reports within radius using Firestore geohash or simple distance calc
      const snapshot = await db.collection('reports')
        .get();

      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(report => {
          if (!report.latitude || !report.longitude) return false;
          return this.calculateDistance(
            lat, lng,
            report.latitude,
            report.longitude
          ) <= radiusKm;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error getting reports by location:', error);
      throw error;
    }
  }

  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}