import express from 'express';
import { AnnouncementsService } from '../services/announcements.service.js';

const router = express.Router();

// GET /api/announcements
router.get('/', async (req, res) => {
  try {
    const announcements = await AnnouncementsService.getAnnouncements();
    res.json({ data: announcements });
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/announcements
router.post('/', async (req, res) => {
  try {
    const { title, message } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'title and message are required' });
    }

    const userId = req.user?.uid || 'admin';
    const announcement = await AnnouncementsService.createAnnouncement(title, message, userId);
    res.status(201).json({ data: announcement });
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await AnnouncementsService.deleteAnnouncement(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
