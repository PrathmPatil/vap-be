import { analyzeCompanies } from "../services/companiesService.js";

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getAnalyzeCompaniesData = asyncHandler(async (req, res) => {
  const result = await analyzeCompanies();
  res.status(200).json(result);
});
