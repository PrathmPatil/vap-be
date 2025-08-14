
import { Op } from 'sequelize';

/**
 * Generic paginated fetch with optional search
 * @param {Model} model - Sequelize model to query
 * @param {Object} query - Request query params
 */
export const getPaginatedData = async (model, query) => {
  const { page = 1, limit = 1000, search = '' } = query;

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

  return {
    total: count,
    page: parseInt(page),
    pages: Math.ceil(count / limit),
    data: rows
  };
};
