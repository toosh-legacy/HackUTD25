import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { ReportsService } from '../services/reports.service.js';

const router = express.Router();

// Admin emails
const ADMIN_EMAILS = ['sai@gmail.com', 'fanenfury@gmail.com'];

const isAdmin = (req) => {
  return req.user && ADMIN_EMAILS.includes(req.user.email);
};

// GET /api/reports - Get user's own reports (requires auth)
router.get('/', verifyAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit } = req.query;
    
    const reports = await ReportsService.getUserReports(userId, limit);
    res.json({ data: reports });
  } catch (err) {
    console.error('Error fetching user reports:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reports/all - Get all reports (admin only)
router.get('/all', verifyAuth, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { limit, lastId } = req.query;
    const reports = await ReportsService.getReports(limit, lastId);
    
    res.json({ data: reports });
  } catch (err) {
    console.error('Error fetching all reports:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports - Create a new report (requires auth)
router.post('/', verifyAuth, async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    const userId = req.user.uid;
    const report = await ReportsService.createReport(req.body, userId);
    res.status(201).json({ data: report });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reports/:id/resolve - Resolve a report (admin only)
router.patch('/:id/resolve', verifyAuth, async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const report = await ReportsService.resolveReport(id);
    
    res.json({ data: report });
  } catch (err) {
    console.error('Error resolving report:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
