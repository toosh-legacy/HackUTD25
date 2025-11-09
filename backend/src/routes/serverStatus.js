import express from 'express';
import { ServerStatusService } from '../services/serverStatus.service.js';

const router = express.Router();

// GET /api/server-status
router.get('/', async (req, res) => {
  try {
    const status = await ServerStatusService.getServerStatus();
    res.json({ data: status });
  } catch (err) {
    console.error('Error fetching server status:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/server-status
router.put('/', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const userId = req.user?.uid || 'admin';
    const updatedStatus = await ServerStatusService.setServerStatus(status, userId);
    res.json({ data: updatedStatus });
  } catch (err) {
    console.error('Error updating server status:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
