import { db } from '../firebase.js';

export class ReportsService {
  static async getReports(limit = 50, lastId = null) {
    let query = db.collection('reports')
      .orderBy('createdAt', 'desc')
      .limit(Number(limit));

    if (lastId) {
      const lastDoc = await db.collection('reports').doc(lastId).get();
      if (lastDoc.exists) {
        query = query.startAfter(lastDoc);
      }
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  static async createReport(reportData, userId) {
    const { title, description, latitude, longitude, severity = 1 } = reportData;
    
    const reportRef = db.collection('reports').doc();
    await reportRef.set({
      title,
      description,
      latitude: latitude || null,
      longitude: longitude || null,
      severity,
      userId,
      createdAt: new Date().toISOString()
    });

    const doc = await reportRef.get();
    return { id: doc.id, ...doc.data() };
  }

  static async getReportsByLocation(lat, lng, radiusKm = 5) {
    // Get reports within radius using Firestore geohash or simple distance calc
    const snapshot = await db.collection('reports')
      .orderBy('createdAt', 'desc')
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
      });
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