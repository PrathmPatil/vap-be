import express from 'express';
import {
  getAllCompanies,
  getCompaniesData,
  getFailedSymbols,
  getListedCompanies
} from '../controllers/stockdatacontroller.js';

const router = express.Router();

router.get('/all-companies', getAllCompanies);
router.get('/companies-data', getCompaniesData);
router.get('/failed-symbols', getFailedSymbols);
router.get('/listed-companies', getListedCompanies);

export default router;
