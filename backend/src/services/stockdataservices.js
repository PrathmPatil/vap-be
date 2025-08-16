
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


 export const getPaginatedDataBySymbol = async (model, req, res) => {
  try {
    const { page = 1, limit = 100, search = "" } = req.query;
    const { symbol: paramSymbol } = req.params || {};

    if (!paramSymbol) {
      return res.status(400).json({
        success: false,
        message: "Symbol is required in URL."
      });
    }

    const offset = (page - 1) * limit;

    let whereClause = {
      [Op.and]: [
        where(fn("LOWER", fn("TRIM", col("symbol"))), {
          [Op.like]: paramSymbol.trim().toLowerCase()
        })
      ]
    };

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          where(fn("LOWER", fn("TRIM", col("symbol"))), {
            [Op.like]: `%${search.trim().toLowerCase()}%`
          })
        ]
      };
    }

    const { rows, count } = await model.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "No data found"
      });
    }

    res.status(200).json({
      success: true,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: rows
    });

  } catch (err) {
    console.error("Pagination Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};