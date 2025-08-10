import express from 'express';
import { AllCompaniesData, CompaniesData, FailedSymbols, ListedCompanies } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Pagination + Search utility
const getPaginatedData = async (model, req, res) => {
  try {
    const { page = 1, limit = 100, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search
      ? {
          [Op.or]: [
            { symbol: { [Op.like]: `%${search}%` } },
            { company_name: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { rows, count } = await model.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Routes
router.get('/all-companies', (req, res) => getPaginatedData(AllCompaniesData, req, res));
router.get('/companies-data', (req, res) => getPaginatedData(CompaniesData, req, res));
router.get('/failed-symbols', (req, res) => getPaginatedData(FailedSymbols, req, res));
router.get('/listed-companies', (req, res) => getPaginatedData(ListedCompanies, req, res));

export default router;
