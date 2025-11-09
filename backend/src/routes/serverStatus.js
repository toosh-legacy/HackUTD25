import express from 'express';
import { ServerStatusService } from '../services/serverStatus.service.js';

const router = express.Router();

// GET /api/server-status - Get global status
router.get('/', async (req, res) => {
  try {
    const status = await ServerStatusService.getServerStatus();
    res.json({ data: status });
  } catch (err) {
    console.error('Error fetching server status:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/server-status - Update global status
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

// GET /api/server-status/locations - Get all location statuses
router.get('/locations', async (req, res) => {
  try {
    const statuses = await ServerStatusService.getLocationStatuses();
    res.json({ data: statuses });
  } catch (err) {
    console.error('Error fetching location statuses:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/server-status/locations/:locationId - Update specific location status
router.put('/locations/:locationId', async (req, res) => {
  try {
    const { locationId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const userId = req.user?.uid || 'admin';
    const updatedStatus = await ServerStatusService.setLocationStatus(locationId, status, userId);
    res.json({ data: updatedStatus });
  } catch (err) {
    console.error('Error updating location status:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/server-status/locations/initialize - Initialize all locations
router.post('/locations/initialize', async (req, res) => {
  try {
    const { locationIds } = req.body;
    
    if (!locationIds || !Array.isArray(locationIds)) {
      return res.status(400).json({ error: 'locationIds array is required' });
    }

    const result = await ServerStatusService.initializeLocationStatuses(locationIds);
    res.json({ data: result });
  } catch (err) {
    console.error('Error initializing location statuses:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
