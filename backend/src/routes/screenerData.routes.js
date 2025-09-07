
import express from 'express';
import CompanyFinancials from '../models/screener/companyFinancials.model.js';

const router = express.Router();

// Get all financial records
router.get('/', async (req, res) => {
  try {
    const data = await CompanyFinancials.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new record
router.post('/', async (req, res) => {
  try {
    const { company, revenue, profit } = req.body;
    const newRecord = await CompanyFinancials.create({ company, revenue, profit });
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
