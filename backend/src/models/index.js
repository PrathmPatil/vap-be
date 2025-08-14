import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Import model definitions
import AllCompaniesDataModel from './all_companies_data.js';
import CompaniesDataModel from './companies_data.js';
import FailedSymbolsModel from './failed_symbols.js';
import ListedCompaniesModel from './listed_companies.js';

import BCModel from './bhavcopy/bc.js';
import BHModel from './bhavcopy/bh.js';
import CorpbondModel from './bhavcopy/corpbond.js';
import ETFModel from './bhavcopy/etf.js';
import FFIXModel from './bhavcopy/ffix.js';
import GLModel from './bhavcopy/gl.js';
import HLModel from './bhavcopy/hl.js';
import PDModel from './bhavcopy/pd.js';
import PRModel from './bhavcopy/pr.js';
import IXModel from './bhavcopy/ix.js';
import MCAPModel from './bhavcopy/mcap.js';

// Initialize Sequelize for first DB: stock_market
const sequelizeStockMarket = new Sequelize(
  process.env.DATABASE || process.env.DB_NAME || 'stock_market',
  process.env.DB_USER || 'root',
  process.env.PASSWORD || process.env.DB_PASS || 'Patil@2000',
  {
    host: process.env.HOST || process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Initialize Sequelize for second DB: bhavcopy
const sequelizeBhavcopy = new Sequelize(
  process.env.BHAVCOPY_DB_NAME || 'bhavcopy_db',
  process.env.BHAVCOPY_DB_USER || process.env.DB_USER || 'root',
  process.env.BHAVCOPY_DB_PASS || process.env.PASSWORD || 'Patil@2000',
  {
    host: process.env.BHAVCOPY_DB_HOST || process.env.HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Initialize models on stock_market DB
const AllCompaniesData = AllCompaniesDataModel(sequelizeStockMarket, DataTypes);
const CompaniesData = CompaniesDataModel(sequelizeStockMarket, DataTypes);
const FailedSymbols = FailedSymbolsModel(sequelizeStockMarket, DataTypes);
const ListedCompanies = ListedCompaniesModel(sequelizeStockMarket, DataTypes);

// (Optionally) Import and initialize bhavcopy-specific models here if you have any
// For example:
// import BhavcopyModel from './bhavcopy_model.js';
const BC = BCModel(sequelizeBhavcopy, DataTypes);
const BH = BHModel(sequelizeBhavcopy, DataTypes);
const Corpbond = CorpbondModel(sequelizeBhavcopy, DataTypes);
const ETF = ETFModel(sequelizeBhavcopy, DataTypes);
const FFIX = FFIXModel(sequelizeBhavcopy, DataTypes);
const GL = GLModel(sequelizeBhavcopy, DataTypes);
const HL = HLModel(sequelizeBhavcopy, DataTypes);
const IX = IXModel(sequelizeBhavcopy, DataTypes);
const MCAP = MCAPModel(sequelizeBhavcopy, DataTypes);
const PD = PDModel(sequelizeBhavcopy, DataTypes);
const PR = PRModel(sequelizeBhavcopy, DataTypes);
export {
  // Sequelize instances
  sequelizeStockMarket,
  sequelizeBhavcopy,

  // Models for stock_market
  AllCompaniesData,
  CompaniesData,
  FailedSymbols,
  ListedCompanies,

  // (Optionally) export Bhavcopy models
  // BhavcopyData
  BC,
  BH,
  Corpbond,
  ETF,
  FFIX,
  GL,
  HL,
  IX,
  MCAP,
  PD,
  PR
};
