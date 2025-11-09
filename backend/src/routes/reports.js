import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { ReportsService } from '../services/reports.service.js';

const router = express.Router();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const { limit, lastId, lat, lng, radius } = req.query;
    
    let reports;
    if (lat && lng) {
      reports = await ReportsService.getReportsByLocation(
        parseFloat(lat),
        parseFloat(lng),
        radius ? parseFloat(radius) : undefined
      );
    } else {
      reports = await ReportsService.getReports(limit, lastId);
    }

    res.json({ data: reports });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    const userId = req.user?.uid || 'anonymous';
    const report = await ReportsService.createReport(req.body, userId);
    res.status(201).json({ data: report });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
