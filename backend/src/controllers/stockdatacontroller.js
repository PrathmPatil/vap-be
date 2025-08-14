
import { AllCompaniesData, CompaniesData, FailedSymbols, ListedCompanies } from '../models/index.js';
import { getPaginatedData } from '../services/stockdataservices.js';

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getAllCompanies = asyncHandler(async (req, res) => {
  const result = await getPaginatedData(AllCompaniesData, req.query);
  res.status(200).json({ success: true, ...result });
});

export const getCompaniesData = asyncHandler(async (req, res) => {
  const result = await getPaginatedData(CompaniesData, req.query);
  res.status(200).json({ success: true, ...result });
});

export const getFailedSymbols = asyncHandler(async (req, res) => {
  const result = await getPaginatedData(FailedSymbols, req.query);
  res.status(200).json({ success: true, ...result });
});

export const getListedCompanies = asyncHandler(async (req, res) => {
  const result = await getPaginatedData(ListedCompanies, req.query);
  res.status(200).json({ success: true, ...result });
});
