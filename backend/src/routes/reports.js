import express from 'express';
import { verifyAuth } from '../middleware/auth.js';
import { ReportsService } from '../services/reports.service.js';

const router = express.Router();

// GET /api/reports
router.get('/', verifyAuth, async (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reports
router.post('/', verifyAuth, async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    const report = await ReportsService.createReport(req.body, req.user.uid);
    res.status(201).json({ data: report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
