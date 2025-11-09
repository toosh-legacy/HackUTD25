import { 
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export class ReportsService {
  static async getReports(pageSize = 50, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'reports'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  static async createReport(reportData) {
    try {
      const docRef = await addDoc(collection(db, 'reports'), {
        ...reportData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }
}

export class AuthService {
  static async getAuthToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }

  static async callApi(endpoint, options = {}) {
    const token = await this.getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }
}