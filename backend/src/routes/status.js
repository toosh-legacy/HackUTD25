import express from 'express';
import { db } from '../firebase.js';

const router = express.Router();

// GET /api/status
router.get('/', async (req, res) => {
  try {
    const reportsRef = db.collection('reports');
    const [snapshot, latestDoc] = await Promise.all([
      reportsRef.count().get(),
      reportsRef.orderBy('createdAt', 'desc').limit(1).get()
    ]);

    const reportsCount = snapshot.data().count;
    const latestReport = latestDoc.empty ? null : {
      id: latestDoc.docs[0].id,
      ...latestDoc.docs[0].data()
    };

    res.json({ reportsCount, latestReport });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
